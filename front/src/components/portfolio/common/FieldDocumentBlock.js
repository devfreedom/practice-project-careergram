import { styled } from "styled-components";
import { FullBtn, FullRedBtn } from "../../common/Btns";
import { useContext } from "react";
import { EditContext } from "../../../contexts/EditContext";
import { deleteData } from "../../../services/api";
import { mainColor } from "../../common/color";

const FieldDocumentBlock = ({
  setDatas,
  children,
  fieldName,
  documentId,
  isDocumentEditing,
  setIsDocumentEditing,
}) => {
  const { isEditing } = useContext(EditContext);
  const handleDeleteDocument = async (e) => {
    e.preventDefault();
    alert("진짜 삭제하실건가요?");
    try {
      await deleteData(documentId, fieldName);
      setDatas((datas) => {
        const deleteddatas = datas.filter(
          (origin) => origin._id !== documentId
        );
        return deleteddatas;
      });
    } catch (err) {
      alert("프론트 데이터 삭제 실패");
    }
  };

  return (
    <Block key={documentId}>
      <div className="data">{children}</div>
      {isEditing && (
        <div className="btns">
          {isDocumentEditing || (
            <>
              <FullBtn
                onClick={() => {
                  setIsDocumentEditing(true);
                }}
              >
                수정
              </FullBtn>
              <FullRedBtn onClick={handleDeleteDocument}>삭제</FullRedBtn>
            </>
          )}
        </div>
      )}
    </Block>
  );
};

export default FieldDocumentBlock;

const Block = styled.div`
  border: solid 3px ${mainColor};
  border-radius: 8px;
  margin: 10px 20px;
  display: flex;
  position: relative;
  padding: 15px 0;
  width: 900px;
  .btns {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 0;
    button {
      height: 50px;
      margin-right: 20px;
    }
  }
`;
