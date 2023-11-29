import { createContext, useRef, useState } from "react";

const UserTokensContext = createContext();

export const UserTokensProvider = ({ children }) => {
  const [allTokens, setAllTokens] = useState({});
  //{
  // [key]: list of tokens
  // }
  return (
    <UserTokensContext.Provider value={{
      setAllTokens,
      allTokens
    }}>
      {children}
    </UserTokensContext.Provider>
  );
};

export default UserTokensContext;
