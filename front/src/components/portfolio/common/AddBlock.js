import { styled } from "styled-components";
import { mainColor } from "../../common/color";

const AddBlock = ({ children }) => {
  return <Block>{children}</Block>;
};

export default AddBlock;

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
