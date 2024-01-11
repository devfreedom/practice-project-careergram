import { useContext, useState } from "react";
import { EmptyBtn, FullBtn } from "../../common/Btns";
import { addData } from "../../../services/api";
import AddBlock from "../common/AddBlock";
import { useNavigate } from "react-router-dom";
import { AddContext } from "../../../contexts/AddContext";

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
    issuer: "",
    certDate: "",
    expDate: "",
    certId: "",
    description: "",
  });

  function handleChange(e, fieldName) {
    setContent((prevContent) => ({
      ...prevContent,
      [fieldName]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    //setDatas에 데이터 추가

    const requiredFields = ["title", "issuer", "certDate"];

    for (const fieldName of requiredFields) {
      if (content[fieldName].trim() === "") {
        alert(`${fieldName} 입력란이 비어있습니다.`);
        return;
      }
    }

    try {
      await addData(editId, "certificate", content);
      setDatas((datas) => [...datas, content]);
      setIsAdding(false);
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
      <form onSubmit={handleSubmit}>
        <div className="input-edit-content">
          <div className="education-main">
            <label className="field-title">자격증명</label>
            <input
              type="text"
              placeholder="수상명"
              value={content?.title}
              onChange={(e) => handleChange(e, "title")}
            />
            <label className="field-title">발급기관</label>
            <input
              type="text"
              placeholder="issuer"
              value={content?.issuer}
              onChange={(e) => handleChange(e, "issuer")}
            />
          </div>
          <div
            className="education-sub"
            style={{
              marginTop: "10px",
            }}
          >
            <label className="field-title">발급일</label>
            <input
              type="date"
              placeholder="수상일"
              value={content?.certDate}
              onChange={(e) => handleChange(e, "certDate")}
            />
            <label className="field-title">만료일</label>
            <input
              type="date"
              placeholder="수상일"
              value={content?.expDate}
              onChange={(e) => handleChange(e, "expDate")}
            />
            <label className="field-title">비고</label>
            <input
              type="text"
              placeholder="설명"
              value={content?.description}
              onChange={(e) => handleChange(e, "description")}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            marginLeft: "700px",
            width: "150px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <FullBtn type="submit">추가</FullBtn>
          <EmptyBtn type="button" onClick={() => setIsAdding(false)}>
            취소
          </EmptyBtn>
        </div>
      </form>
    </AddBlock>
  );
};
