import { useContext, useEffect } from "react";
import LoginForm from "../components/login/LoginForm";
import LayoutPage from "./LayoutPage";
import { EditContext } from "../contexts/EditContext";
import { useNavigate } from "react-router";
import { UserStateContext } from "../App";

const LoginPage = () => {
  const { setIsEditing } = useContext(EditContext);
  useEffect(() => {
    setIsEditing(false);
  });

  //로그인 상태시 로그인 페이지 접근 불가능
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
      <LoginForm />
    </LayoutPage>
  );
};

export default LoginPage;
