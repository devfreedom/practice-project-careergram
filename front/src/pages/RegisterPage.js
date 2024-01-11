import RegisterForm from "../components/register/RegisterForm";
import LayoutPage from "./LayoutPage";
import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { UserStateContext } from "../App";

const RegisterPage = () => {
  //로그인 상태시 회원가입 페이지 접근 불가능
  const userState = useContext(UserStateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.user) {
      navigate("/", { replace: true });
      return;
    }
  }, [userState.user, navigate]);

  return (
    <LayoutPage>
      <RegisterForm />
    </LayoutPage>
  );
};

export default RegisterPage;
