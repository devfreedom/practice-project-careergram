import { styled } from "styled-components";
import { hoverColor, mainColor } from "../common/color";

//현재 카테고리를 전달받아서 active에만 스타일을 추가함
const Category = ({ category, setCategory, categoryList }) => {
  const renderCategory = () => {
    return categoryList.map((item, index) => (
      <button
        key={index}
        className={category === item ? "cate-active" : "cate-other"}
        onClick={() => {
          setCategory(item);
        }}
      >
        {item}
      </button>
    ));
  };
  return <CategoryBlock>{renderCategory()}</CategoryBlock>;
};

export default Category;

const CategoryBlock = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  position: absolute;
  top: -35px;
  right: 200px;
  left: 200px;
  .cate-other {
    background-color: ${hoverColor};
    margin: 10px;
    padding: 10px;
    width: 150px;
    color: white;
    border-radius: 30px;
    &:hover {
      background-color: ${mainColor};
      position: relative;
      top: 3px;
      z-index: 1;
    }
  }

  .cate-active {
    background-color: ${mainColor};
    position: relative;
    top: 3px;
    margin: 10px;
    padding: 10px;
    width: 150px;
    color: white;
    border-radius: 30px;
    z-index: 1;
  }
`;
