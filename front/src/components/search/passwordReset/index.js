import { styled } from "styled-components";
import { EmptyBtn, FullRedBtn } from "../../common/Btns";
import { useContext, useEffect, useState } from "react";
import { userPasswordReset } from "../../../services/ect";
import { UserStateContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { mainColor } from "../../common/color";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const userState = useContext(UserStateContext);

  useEffect(() => {
    if (userState?.user?.id) {
      navigate("/");
    }
  }, [userState, navigate]);

  async function handleClick() {
    try {
      if (!email) {
        alert("이메일을 입력해주세요.");
        return;
      }
      if (!email) {
        alert("이름 혹은 본인 확인 가능한 정보를 입력해주세요.");
        return;
      }
      const sendData = {
        inputEmail: email,
        inputProof: name,
      };

      await userPasswordReset(sendData);

      alert("변경되었습니다. 이메일을 확인해주세요.");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <WithdrawalBlock onSubmit={handleClick}>
      <h1>비밀번호 찾기</h1>
      <label className="withdrawl-label">Email |</label>
      <input
        value={email}
        placeholder="사용자 계정을 입력해주세요."
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="withdrawl-label">Name |</label>
      <input
        value={name}
        placeholder="사용자 이름을 입력해주세요."
        onChange={(e) => setName(e.target.value)}
      />
      <div className="pwBtns">
        <FullRedBtn>비밀번호 찾기</FullRedBtn>
        <EmptyBtn
          type="button"
          onClick={() => {
            navigate("/login");
          }}
        >
          취소
        </EmptyBtn>
      </div>
    </WithdrawalBlock>
  );
};

export default PasswordReset;

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
