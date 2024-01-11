import { styled } from "styled-components";
import { mainColor } from "./color";

const FullBtn = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${mainColor};
  border: 2px solid ${mainColor};
  color: #ffffff;
`;

const FullRedBtn = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: red;
  border: 2px solid red;
  color: #ffffff;
`;

const EmptyBtn = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid ${mainColor};
`;

export { FullBtn, EmptyBtn, FullRedBtn };
