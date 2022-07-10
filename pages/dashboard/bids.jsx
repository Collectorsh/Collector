import React, { useState, useEffect, useCallback, useContext } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import getUserBids from "/data/user/getUserBids";
import CollectorBids from "/components/dashboard/bids/CollectorBids";
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
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <MainNavigation />
      <div className="mt-16 sm:mt-36">
        <div className="clear-both">
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit py-1 inline-block dark:text-whitish">
            Bids
          </h2>
          {user && noBids && (
            <p className="dark:text-gray-100">
              You don&apos;t currently have any bids
            </p>
          )}
          {bids && !noBids && <CollectorBids bids={bids} />}
        </div>
      </div>
    </div>
  );
}

export default Bids;
