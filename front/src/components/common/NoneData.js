import { styled } from "styled-components";

const NoneData = () => {
  return (
    <NoneDataBlock>
      <div>게시글이 없습니다.</div>
    </NoneDataBlock>
  );
};

export default NoneData;

const NoneDataBlock = styled.div`
  padding: 30px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
