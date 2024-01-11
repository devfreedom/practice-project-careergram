import { styled } from "styled-components";
import { EmptyBtn, FullRedBtn } from "../../common/Btns";
import { useContext, useState } from "react";
import { userDelete } from "../../../services/ect";
import { mainColor } from "../../common/color";
import { useNavigate } from "react-router-dom";
import { DispatchContext } from "../../../App";

const Withdrawal = ({ setIsExiting }) => {
  const navigator = useNavigate();
  const dispatch = useContext(DispatchContext);

  const [userEmail, setUserEmail] = useState("");
  const [userPw, setUserPw] = useState("");

  async function handleClick() {
    if (!userEmail || !userPw) {
      alert("탈퇴하시려면 이메일과 비밀번호를 입력해주세요.");
      setIsExiting(true);
      setUserEmail("");
      setIsExiting("");
      return;
    }

    try {
      await userDelete(userEmail, userPw);
      alert("탈퇴하십니까?");
      userDelete(userEmail, userPw);
      alert("탈퇴되었습니다.");
      sessionStorage.removeItem("userToken");
      dispatch({ type: "LOGOUT" });
      navigator("/login");
    } catch (err) {
      alert(err?.message || err);
    }
  }

  return (
    <Modal>
      <WithdrawalBlock onSubmit={handleClick}>
        <h1>회원 탈퇴</h1>
        <label className="withdrawl-label">Email |</label>
        <input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <label className="withdrawl-label">Password |</label>
        <input value={userPw} onChange={(e) => setUserPw(e.target.value)} />
        <EmptyBtn
          type="button"
          onClick={() => {
            setIsExiting(false);
          }}
        >
          취소
        </EmptyBtn>
        <FullRedBtn>탈퇴</FullRedBtn>
      </WithdrawalBlock>
    </Modal>
  );
};

export default Withdrawal;

const Modal = styled.div`
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WithdrawalBlock = styled.form`
  width: 400px;
  height: 400px;
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  margin: 60px auto;
  margin-top: 100px;
  border: solid 1px ${mainColor};
  border-radius: 8px;
  background-color: white;
  h1 {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 30px;
  }
  .withdrawl-label {
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
  button {
    margin-top: 10px;
  }
  .pwBtns {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
`;
