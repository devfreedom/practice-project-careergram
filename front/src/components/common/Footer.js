import { styled } from "styled-components";

const Footer = () => {
  return (
    <FooterBlock>
      <div>
        <ul className="front">
          <li className="developer" key="front">
            FRONT
          </li>
          <li key="ah">정아현</li>
          <li key="jae">이재민</li>
        </ul>
        <ul className="back">
          <li className="developer" key="back">
            BACK
          </li>
          <li key="dong">황동운</li>
          <li key="jun">김준섭</li>
          <li key="young">지영은</li>
        </ul>
      </div>
    </FooterBlock>
  );
};

export default Footer;

const FooterBlock = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 250px;
  background-color: #eeeeee;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      li.developer {
        font-size: 17px;
        font-weight: 600;
      }
    }
  }
`;
