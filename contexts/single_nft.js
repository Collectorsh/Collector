import { createContext, useState } from "react";

const SingleNftContext = createContext();

export const SingleNftProvider = ({ children }) => {
  const [singleNft, setSingleNft] = useState({});

  return (
    <SingleNftContext.Provider value={[singleNft, setSingleNft]}>
      {children}
    </SingleNftContext.Provider>
  );
};

export default SingleNftContext;
