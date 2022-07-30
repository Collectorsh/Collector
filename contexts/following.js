import { createContext, useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { getFollowingQuery } from "/queries/following";

const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);

  const [getFollowingQl] = useLazyQuery(getFollowingQuery, {
    fetchPolicy: "network-only",
  });

  const updateFollowing = useCallback(async (pubKeys) => {
    const res = await getFollowingQl({
      variables: {
        from: pubKeys,
      },
    });
    const flw = res.data.connections.map((c) => c.to.address);
    setFollowing(flw);
  }, []);

  return (
    <FollowingContext.Provider value={[following, updateFollowing]}>
      {children}
    </FollowingContext.Provider>
  );
};

export default FollowingContext;
