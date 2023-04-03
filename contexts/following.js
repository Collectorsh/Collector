import { createContext, useState } from "react";

const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);

  return (
    <FollowingContext.Provider value={[following, setFollowing]}>
      {children}
    </FollowingContext.Provider>
  );
};

export default FollowingContext;
