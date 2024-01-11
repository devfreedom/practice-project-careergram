import { useContext, useEffect } from "react";
import Network from "../components/network/Network";
import LayoutPage from "./LayoutPage";
import { EditContext } from "../contexts/EditContext";

const NetworkPage = () => {
  //네트워크 페이지 이동 시 편집 상태 해제
  const { setIsEditing } = useContext(EditContext);

  useEffect(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  return (
    <LayoutPage>
      <Network />
    </LayoutPage>
  );
};

export default NetworkPage;
