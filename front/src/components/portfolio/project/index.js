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
const Project = ({ user }) => {
  const userId = user?.id;
  const [datas, setDatas] = useState([]);
  const [isNotFetching, setIsNotFetching] = useState(false);

  useEffect(() => {
    getDatas(userId, "project")
      .then((res) => {
        setDatas(res.data);
        setIsNotFetching(true);
      })
      .catch((err) => {
        alert(`EDUCATION 데이터 가져오기 실패: ${err}`);
        return;
      });
  }, [setDatas, userId, isNotFetching]);

  if (!isNotFetching) {
    return <Loading />;
  }

  return <FieldContainer datas={datas} setDatas={setDatas} userId={userId} />;
};

export default Project;

//Model에서 받아온 전체 데이터를 map
const FieldContainer = ({ datas, setDatas, userId }) => {
  const { isEditing } = useContext(EditContext);

  return (
    <FieldListBlock>
      <h1 className="fieldName">Project</h1>
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
      await updateData(data?._id, "project", content);

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
        fieldName={"title"}
        documentId={data?._id}
        isDocumentEditing={isDocumentEditing}
        setIsDocumentEditing={setIsDocumentEditing}
      >
        <form onSubmit={handlePutSubmit}>
          <div className="input-edit-content">
            <div className="education-main">
              <label className="field-title">프로젝트명</label>
              <input
                type="text"
                placeholder="프로젝트명"
                value={content?.title}
                onChange={(e) => handleChange(e, "title")}
              />
              <label className="field-title">소속 단체</label>
              <input
                type="text"
                placeholder="단체 프로젝트일 경우 입력해주세요"
                value={content?.organization}
                onChange={(e) => handleChange(e, "organization")}
              />
            </div>
            <div className="education-sub">
              <label className="field-title">시작일</label>
              <input
                type="date"
                placeholder="시작일"
                value={content?.startDate}
                onChange={(e) => handleChange(e, "startDate")}
              />
              <label className="field-title">종료일</label>
              <input
                type="date"
                placeholder="종료일"
                value={content?.endDate}
                onChange={(e) => handleChange(e, "endDate")}
              />
              <label className="field-title">비고</label>
              <input
                type="text"
                placeholder="비고"
                value={content?.description}
                onChange={(e) => handleChange(e, "description")}
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
        fieldName={"project"}
        isDocumentEditing={isDocumentEditing}
        setIsDocumentEditing={setIsDocumentEditing}
      >
        <div className="field-main before partition">
          <div className="field-content" style={{ width: "400px" }}>
            <span className="field-title" style={{ width: "100px" }}>
              프로젝트명 |{" "}
            </span>
            {data.title}
          </div>
          {data.organization && (
            <div className="field-content">
              <span className="field-title">소속단체 | </span>
              {data.organization}
            </div>
          )}
        </div>
        <div className="field-last partition">
          <div className="field-conent date">
            <span className="field-title">기간 | </span>
            <span className="num">
              {data.startDate} - {data.endDate}
            </span>
          </div>
        </div>
        {data.description && (
          <div className="field-sub-content">
            <span className="field-title">비고 | </span>
            {data.description}
          </div>
        )}
      </FieldDocumentBlock>
    );
  }
};
