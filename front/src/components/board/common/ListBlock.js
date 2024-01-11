import { styled } from "styled-components";

const ListBlock = ({ children }) => {
  return <StyledListBlock>{children}</StyledListBlock>;
};

export default ListBlock;

const StyledListBlock = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 1000px;
  position: relative;
`;
