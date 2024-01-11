import { styled } from "styled-components";
import { mainColor } from "../common/color";

const Pagination = ({ totalPages, currentPage, handlePage }) => {
  currentPage = Number(currentPage);
  function handleLeftClick() {
    handlePage(currentPage - 1);
  }

  function handleRightClick() {
    handlePage(currentPage + 1);
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => {
            handlePage(i);
          }}
        >
          {i}
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <PaginationBlock className="pagination">
      <ul className="pagination-list">
        <li
          className={currentPage === 1 ? "disabled" : ""}
          onClick={currentPage === 1 ? null : handleLeftClick}
        >
          &lt;
        </li>

        {/* 페이지 번호 */}
        {renderPageNumbers()}

        <li
          className={currentPage === totalPages ? "disabled" : ""}
          onClick={currentPage === totalPages ? null : handleRightClick}
        >
          &gt;
        </li>
      </ul>
    </PaginationBlock>
  );
};

export default Pagination;

const PaginationBlock = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ul {
    display: flex;
    width: 50%;
    justify-content: space-between;
    align-items: center;
    li {
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 35px;
      border-radius: 50%;
      cursor: pointer;
    }
    li.active {
      color: ${mainColor};
      font-size: 22px;
    }
    li:hover {
      color: ${mainColor};
    }
    li.disabled {
      font-size: 15px;
      cursor: not-allowed;
      color: gray;
    }
  }
`;
