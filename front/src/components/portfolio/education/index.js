import { getDatas, updateData } from "../../../services/api";
import { useContext, useEffect, useState } from "react";
import { EditContext } from "../../../contexts/EditContext";
import FieldListBlock from "../common/FieldListBlock";
import DocumentAddBtn from "./DocumentAddBtn";
import FieldDocumentBlock from "../common/FieldDocumentBlock";
import { EmptyBtn, FullBtn } from "../../common/Btns";
import Loading from "../../common/Loading";
import NoneData from "../../common/NoneData";

//api로 Model의 전체 데이터를 요청
const Education = ({ user }) => {
  const userId = user?.id;
  const [educations, setEducations] = useState([]);
  const [isNotFetching, setIsNotFetching] = useState(false);

  useEffect(() => {
    getDatas(userId, "education")
      .then((res) => {
        setEducations(res.data);
        setIsNotFetching(true);
      })
      .catch((err) => {
        alert(`EDUCATION 데이터 가져오기 실패: ${err}`);
        return;
      });
  }, [setEducations, userId, isNotFetching]);

  if (!isNotFetching) {
    return <Loading />;
  }

  return (
    <FieldContainer
      datas={educations}
      setDatas={setEducations}
      userId={userId}
    />
  );
};

export default Education;

//Model에서 받아온 전체 데이터를 map
const FieldContainer = ({ datas, setDatas, userId }) => {
  const { isEditing } = useContext(EditContext);

  return (
    <FieldListBlock>
      <h1 className="fieldName">Education</h1>
      {datas.length > 0 ? (
        datas.map((data) => (
          <DocumentItem key={data?._id} data={data} setDatas={setDatas} />
        ))
      ) : (
        <NoneData />
      )}
      {isEditing && <DocumentAddBtn setDatas={setDatas} editId={userId} />}
    </FieldListBlock>
  );
};

const DocumentItem = ({ data, setDatas }) => {
  //해당 Model이 현재 편집상태인지 확인
  const { isEditing } = useContext(EditContext);
  //해당 document가 현재 편집상태인지 확인
  const [isDocumentEditing, setIsDocumentEditing] = useState(false);

  //해당 Document field의 content를 State로 관리
  const [content, setContent] = useState(data);

  //field의 value onChange 시 content 변경
  function handleChange(e, fieldName) {
    setContent((prevContent) => ({
      ...prevContent,
      [fieldName]: e.target.value,
    }));
  }

  // 수정 버튼 클릭시 해당 filedName으로 업데이트(put)요청 보내기
  async function handlePutSubmit(e) {
    e.preventDefault();

    try {
      await updateData(data?._id, "education", content);

      setDatas((datas) => {
        return datas.map((origindata) => {
          if (origindata._id === data?._id) {
            return content;
          }
          return origindata;
        });
      });

      setIsDocumentEditing(false);
    } catch (err) {
      alert(`EDUCATION 데이터 PUT 요청 실패: ${err}`);
    }
  }

  // 초기화 시 데이터 다시 불러오기
  function handleGetDocument(e) {
    e.preventDefault();

    // 저장한 데이터를 다시 보여주기
    setContent(data);
  }

  // 해당 field 저장한 State 출력하기
  if (isDocumentEditing && isEditing) {
    return (
      <FieldDocumentBlock
        setDatas={setDatas}
        fieldName={"education"}
        documentId={data?._id}
        isDocumentEditing={isDocumentEditing}
        setIsDocumentEditing={setIsDocumentEditing}
      >
        <form onSubmit={handlePutSubmit}>
          <div className="input-edit-content">
            <div className="education-main">
              <label className="field-title">교육기관</label>
              <input
                type="text"
                placeholder="교육기관"
                value={content?.institution}
                onChange={(e) => handleChange(e, "institution")}
              />
              <label
                className="field-title"
                style={{
                  width: "40px",
                }}
              >
                전공
              </label>
              <input
                type="text"
                placeholder="전공"
                value={content?.major}
                onChange={(e) => handleChange(e, "major")}
              />
              <label
                className="field-title"
                style={{
                  width: "60px",
                }}
              >
                학위
              </label>
              <select
                value={content.degree || "학사"}
                onChange={(e) => handleChange(e, "degree")}
              >
                <option value="학사">학사</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
              </select>
              <label
                className="field-title"
                style={{
                  width: "60px",
                  marginBottom: "20px",
                }}
              >
                상태
              </label>
              <select
                value={content.status || "졸업"}
                onChange={(e) => handleChange(e, "status")}
              >
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
                <option value="중퇴">중퇴</option>
                <option value="졸업">졸업</option>
                <option value="졸업예정">졸업예정</option>
              </select>
            </div>
            <div className="education-sub">
              <label className="field-title">입학년월</label>
              <input
                type="date"
                placeholder="입학년월"
                value={content?.entryDate}
                onChange={(e) => handleChange(e, "entryDate")}
              />
              <label className="field-title">졸업년월</label>
              <input
                type="date"
                placeholder="졸업년월"
                value={content?.gradDate}
                onChange={(e) => handleChange(e, "gradDate")}
              />
              <label className="field-title">학점</label>
              <input
                type="text"
                placeholder="학점"
                value={content?.grade}
                onChange={(e) => handleChange(e, "grade")}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              marginLeft: "600px",
              width: "250px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FullBtn type="submit">수정</FullBtn>
            <EmptyBtn onClick={handleGetDocument}>초기화</EmptyBtn>
            <FullBtn
              onClick={() => {
                setIsDocumentEditing(false);
              }}
            >
              취소
            </FullBtn>
          </div>
        </form>
      </FieldDocumentBlock>
    );
  } else {
    return (
      // IsEditing 상태 아닐때 응답받은 Field Document 보여주기
      <FieldDocumentBlock
        setDatas={setDatas}
        documentId={data?._id}
        fieldName={"education"}
        isDocumentEditing={isDocumentEditing}
        setIsDocumentEditing={setIsDocumentEditing}
      >
        <div className="field-main before partition">
          <div
            className="field-content"
            style={{
              width: "400px",

              overflow: "hidden",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="field-title">교육기관 | </span>
            {data?.institution}
          </div>
          <div
            className="field-content"
            style={{
              width: "300px",

              overflow: "hidden",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="field-title">전공명 | </span>
            {data?.major}
          </div>
        </div>
        <div className="field-sub partition">
          <div
            className="field-sub-content"
            style={{
              width: "200px",

              overflow: "hidden",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="field-title">학위 | </span>
            {data?.degree}
          </div>
          <div
            className="field-sub-content"
            style={{
              width: "200px",

              overflow: "hidden",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="field-title">학력 상태 | </span>
            {data?.status}
          </div>
          <div className="field-last partition">
            <div
              className="field-sub-content"
              style={{
                width: "200px",
                overflow: "hidden",
                whiteSpace: "wrap",
                textOverflow: "ellipsis",
              }}
            >
              <span className="field-title">학점 | </span>
              {data?.grade}
            </div>
          </div>
        </div>
        <div className="field-last partition">
          <div className="field-conent date">
            <span className="field-title">기간 | </span>
            <span className="num">
              {data?.entryDate} - {data?.gradDate}
            </span>
          </div>
        </div>
        {data.description && (
          <div className="field-last partition">
            <div className="field-sub-content">
              <span className="field-title">비고 | </span>
              {data.description}
            </div>
          </div>
        )}
      </FieldDocumentBlock>
    );
  }
};
