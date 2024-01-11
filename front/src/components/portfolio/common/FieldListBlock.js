import { styled } from "styled-components";
import { mainColor } from "../../common/color";

const FieldListBlock = ({ children }) => {
  return <ListBlock>{children}</ListBlock>;
};

export default FieldListBlock;

const ListBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding: 5px 20px;
  border-radius: 15px;
  margin: 30px;
  position: relative;
  padding-top: 40px;
  .fieldName {
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
    position: relative;
    padding: 20px 0;
    text-align: left;
    &::after {
      content: "";
      background-color: ${mainColor};
      height: 5px;
      position: absolute;
      width: 100%;
      right: 10px;
      bottom: 0;
    }
  }
`;
