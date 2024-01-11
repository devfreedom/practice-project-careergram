import { useContext, useState } from "react";
import { EmptyBtn, FullBtn } from "../../common/Btns";
import { addData } from "../../../services/api";
import AddBlock from "../common/AddBlock";
import { AddContext } from "../../../contexts/AddContext";
import { useNavigate } from "react-router-dom";

const DocumentAddBtn = ({ setDatas, editId }) => {
  // isEditing 상태가 되면 각 education 필드에 add 버튼 생성
  const [isAdding, setIsAdding] = useState(false);
  return (
    <div>
      {!isAdding && (
        <EmptyBtn
          className="addingBtn"
          onClick={() => setIsAdding((isAdding) => !isAdding)}
          style={{
            marginTop: "30px",
            width: "100%",
          }}
        >
          +
        </EmptyBtn>
      )}
      {isAdding && (
        <DocumentAddItem
          setDatas={setDatas}
          setIsAdding={setIsAdding}
          editId={editId}
        />
      )}
    </div>
  );
};

export default DocumentAddBtn;

//add 버튼 클릭 시 데이터 입력 폼 생성
const DocumentAddItem = ({ setIsAdding, setDatas, editId }) => {
  // newData를 state에 담아서 관리(index.js 중복 사용을 위해 명칭통일함)
  const { setAdded } = useContext(AddContext);
  const navigate = useNavigate();

  const [content, setContent] = useState({
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  function handleChange(e, fieldName) {
    setContent((prevContent) => ({
      ...prevContent,
      [fieldName]: e.target.value,
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    //setDatas에 데이터 추가

    const requiredFields = ["title", "startDate", "endDate"];

    for (const fieldName of requiredFields) {
      if (content[fieldName].trim() === "") {
        alert(`${fieldName} 입력란이 비어있습니다.`);
        return;
      }
    }

    try {
      await addData(editId, "project", content);
      setDatas((datas) => [...datas, content]);
      alert("추가 성공, 다시 편집모드로 들어와주세요.");
      setIsAdding(false);
      setAdded(true);
      navigate("/network");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <AddBlock>
      <form onSubmit={handleAddSubmit} className="input-edit">
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
            <label className="field-title" style={{ width: "70px" }}>
              시작일
            </label>
            <input
              type="date"
              placeholder="시작일"
              value={content?.startDate}
              onChange={(e) => handleChange(e, "startDate")}
            />
            <label
              className="field-title"
              style={{ width: "70px", marginTop: "10px" }}
            >
              종료일
            </label>
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
        <div>
          <FullBtn type="submit">추가</FullBtn>
          <EmptyBtn type="button" onClick={() => setIsAdding(false)}>
            취소
          </EmptyBtn>
        </div>
      </form>
    </AddBlock>
  );
};
