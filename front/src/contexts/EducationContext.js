import { createContext, useState } from "react";

const EducationContext = createContext();

const EducationContextProvider = ({ children }) => {
  const [educationDocuments, setEducationDocuments] = useState([]);

  return (
    <EducationContext.Provider
      value={{ educationDocuments, setEducationDocuments }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export { EducationContext, EducationContextProvider };

// services/api 사용하지 말고 useReducer로 사용해도 될듯
