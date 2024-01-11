import Education from "./education";
import Award from "./award";
import { styled } from "styled-components";
import FastMove from "./common/FastMove";
import { useRef } from "react";
import Certificate from "./certificate";
import Project from "./project";

const PortfolioList = ({ user, isEditing }) => {
  const scrollElement = useRef([]);

  return (
    <PortfolioListBlock id="portfolio">
      <FastMove scrollElement={scrollElement} />
      <div ref={(el) => (scrollElement.current[1] = el)}>
        <Education user={user} isEditing={isEditing} />
      </div>
      <div ref={(el) => (scrollElement.current[2] = el)}>
        <Award user={user} isEditing={isEditing} />
      </div>
      <div ref={(el) => (scrollElement.current[3] = el)}>
        <Certificate user={user} isEditing={isEditing} />
      </div>
      <div ref={(el) => (scrollElement.current[4] = el)}>
        <Project user={user} isEditing={isEditing} />
      </div>
    </PortfolioListBlock>
  );
};

export default PortfolioList;

const PortfolioListBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 80px;
`;
