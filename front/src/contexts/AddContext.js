// 수정시 education res.data 추가 안됨  >> 새로고침 필요 >> 네트워크페이지로 갔다가 돌아오는 임시방편

import { createContext, useState } from "react";

const AddContext = createContext();

const AddContextProvider = ({ children }) => {
  const [added, setAdded] = useState(false);

  return (
    <AddContext.Provider value={{ added, setAdded }}>
      {children}
    </AddContext.Provider>
  );
};

export { AddContext, AddContextProvider };
