import { useContext, useEffect } from "react";
import Portfolio from "../components/portfolio";
import LayoutPage from "./LayoutPage";
import { EditContext } from "../contexts/EditContext";

const PortfolioPage = () => {
  const { setIsEditing } = useContext(EditContext);
  useEffect(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  return (
    <LayoutPage>
      <Portfolio />
    </LayoutPage>
  );
};

export default PortfolioPage;
