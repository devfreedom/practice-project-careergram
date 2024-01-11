import { createContext, useState } from "react";

const EditContext = createContext();

const EditContextProvider = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);

  const turnEditing = () => {
    setIsEditing((isEditing) => !isEditing);
  };

  const contextValue = {
    setIsEditing,
    isEditing,
    turnEditing,
  };

  return (
    <EditContext.Provider value={contextValue}>{children}</EditContext.Provider>
  );
};

export { EditContext, EditContextProvider };
