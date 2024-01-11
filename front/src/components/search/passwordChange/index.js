import { styled } from "styled-components";
import { EmptyBtn, FullRedBtn } from "../../common/Btns";
import { useContext, useEffect, useState } from "react";
import { userPasswordChange } from "../../../services/ect";
import { DispatchContext, UserStateContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { mainColor } from "../../common/color";

const PasswordChange = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [userId, setUserId] = useState(null);

  const userState = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);

  async function handleClick() {
    try {
      if (!email || !oldPw || !newPw || !newPwConfirm) {
        alert("입력값을 확인해주세요");
        setEmail("");
        setOldPw("");
        setNewPw("");
        setNewPwConfirm("");
        return;
      } else if (newPw !== newPwConfirm) {
        alert("비밀번호가 다릅니다.");
        setEmail("");
        setOldPw("");
        setNewPw("");
        setNewPwConfirm("");
        return;
      } else if (newPw.length < 6 && newPw.length > 12) {
        alert("새로운 비밀번호는 6글자 이상 12글자 이하로 입력해주세요.");
        setEmail("");
        setOldPw("");
        setNewPw("");
        setNewPwConfirm("");
        return;
      }
      const sendData = {
        email: email,
        inputPassword: oldPw,
        newPassword: newPw,
        newPasswordConfirm: newPwConfirm,
      };

      alert("비밀번호 변경하십니까?");

      await userPasswordChange(userId, sendData);

      alert("변경되었습니다. 다시 로그인해주세요. ");
      sessionStorage.removeItem("userToken");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (!userState.user) {
      navigate("/login", { replace: true });
      return;
    } else {
      setUserId(userState.user.id);
    }
  }, [navigate, setUserId, userState.user]);

  return (
    <WithdrawalBlock onSubmit={handleClick}>
      <h1>비밀번호 변경</h1>
      <label className="withdrawl-label">Email |</label>
      <input
        value={email}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="withdrawl-label">Origin Password |</label>
      <input
        autoComplete="current-password"
        value={oldPw}
        type="password"
        onChange={(e) => setOldPw(e.target.value)}
      />
      <label className="withdrawl-label">New Password |</label>
      <input
        autoComplete="new-password"
        value={newPw}
        type="password"
        onChange={(e) => setNewPw(e.target.value)}
      />
      <label className="withdrawl-label">New Password Confirm |</label>
      <input
        value={newPwConfirm}
        type="password"
        onChange={(e) => setNewPwConfirm(e.target.value)}
      />
      <div className="pwBtns">
        <FullRedBtn>비밀번호 변경</FullRedBtn>
        <EmptyBtn
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          취소
        </EmptyBtn>
      </div>
    </WithdrawalBlock>
  );
};

export default PasswordChange;

const WithdrawalBlock = styled.form`
  width: 500px;
  height: 500px;
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  margin: 60px auto;
  margin-top: 100px;
  border: solid 3px ${mainColor};
  border-radius: 8px;
  h1 {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 30px;
  }
  .withdrawl-label {
    margin: 0 15px;
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
    margin: 0 30px;
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
