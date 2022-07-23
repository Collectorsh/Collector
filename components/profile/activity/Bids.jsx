import React, { useState, useEffect, useCallback, useContext } from "react";
import getUserBids from "/data/user/getUserBids";
import CollectorBids from "/components/profile/activity/CollectorBids";
import UserContext from "/contexts/user";

function Bids() {
  const [user, setUser] = useContext(UserContext);
  const [bids, setBids] = useState();
  const [noBids, setNoBids] = useState(false);

  const initUserBids = useCallback(async () => {
    try {
      let res = await getUserBids(user.id);
      if (res.status === "success" && res.bids.length > 0) {
        setBids(res.bids);
      } else {
        setNoBids(true);
      }
    } catch (err) {
      console.log(err);
      setNoBids(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initUserBids();
  }, [user]);

  return (
    <>
      <div className="mt-16">
        <div className="clear-both">
          {user && noBids && (
            <p className="dark:text-gray-100">
              You don&apos;t currently have any open bids
            </p>
          )}
          {bids && !noBids && <CollectorBids bids={bids} />}
        </div>
      </div>
    </>
  );
}

export default Bids;
