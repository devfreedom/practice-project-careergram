import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserStateContext, DispatchContext } from "../../App";
import { styled } from "styled-components";
import { mainColor } from "./color";

function Header() {
  const navigate = useNavigate();

  const userState = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);

  // 전역상태에서 user가 null이 아니라면 로그인 성공 상태임.
  const isLogin = !!userState.user;

  // 로그아웃 클릭 시 실행되는 함수
  const logout = () => {
    // sessionStorage 에 저장했던 JWT 토큰을 삭제함.
    sessionStorage.removeItem("userToken");
    // dispatch 함수를 이용해 로그아웃함.
    dispatch({ type: "LOGOUT" });
    // 기본 페이지로 돌아감.
  };

  return (
    <HeaderBlock>
      <Logo className="logo" key="logo">
        Career <span>Gram</span>
      </Logo>
      <ul>
        {isLogin ? (
          <li key="myPage" onClick={() => navigate("/")}>
            나의 페이지
          </li>
        ) : (
          <li key="myPage" onClick={() => navigate("/register")}>
            페이지 생성
          </li>
        )}
        <li key="network" onClick={() => navigate("/network")}>
          네트워크
        </li>
        <li key="board" onClick={() => navigate("/board")}>
          게시판
        </li>
        {isLogin ? (
          <li
            key="logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            로그아웃
          </li>
        ) : (
          <li key="login" onClick={() => navigate("/login")}>
            로그인
          </li>
        )}
      </ul>
    </HeaderBlock>
  );
}

export default Header;

const HeaderBlock = styled.div`
  background-color: ${mainColor};
  z-index: 1000;
  position: fixed;
  width: 100%;
  min-width: 700px;
  height: 50px;
  padding: 0 50px;
  display: flex;
  z-index: 100;
  justify-content: space-between;
  .logged-out {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  }

  span {
    color: #ffffff;
  }
  ul {
    display: flex;
    width: 400px;
    justify-content: space-between;
    line-height: 50px;
    li {
      position: relative;
      cursor: pointer;
      color: #ffffff;
      &:hover {
        color: #ffffff;
        font-size: 18px;
      }
    }
  }
`;

const Logo = styled.li`
  font-size: 30px;
  font-weight: 700;
`;
