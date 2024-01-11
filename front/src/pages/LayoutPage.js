import { styled } from "styled-components";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

const LayoutPage = ({ children }) => {
  return (
    <LayoutPageBlock>
      <header>
        <Header />
      </header>
      <main
        style={{
          paddingTop: "50px",
          paddingBottom: "250px",
          width: "1350px",
          margin: "0 auto",
          minHeight: "970px",
        }}
      >
        {children}
      </main>
      <footer style={{ position: "relative", marginTop: "100px" }}>
        <Footer />
      </footer>
    </LayoutPageBlock>
  );
};

export default LayoutPage;

const LayoutPageBlock = styled.div``;
