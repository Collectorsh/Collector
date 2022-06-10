import React, { useState, useEffect, useCallback, useContext } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import FollowingAuctions from "/components/dashboard/following/FollowingAuctions";
import getFollowingAuctions from "/data/artists/getFollowingAuctions";
import UserContext from "/contexts/user";

export default function Following() {
  const [user, setUser] = useContext(UserContext);
  const [auctions, setAuctions] = useState([]);
  const [noAuctions, setNoAuctions] = useState(false);

  const initFollowingAuctions = useCallback(async (user) => {
    let res = await getFollowingAuctions(user.api_key);
    if (res.status === "success" && res.auctions.length > 0) {
      setAuctions(res.auctions);
    } else {
      setNoAuctions(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingAuctions(user);
  }, [user]);

  return (
    <div className="min-h-screen dark:bg-black">
      <CheckLoggedIn />
      <MainNavigation />
      <div className="mx-auto px-2 md:px-4 lg:px-12">
        <div className="mx-auto px-2 md:px-0">
          <div className="mb-12">
            <div className="w-full mt-16 sm:mt-36 mb-6">
              <h2 className="text-5xl font-extrabold mb-8 text-black w-fit py-1 inline-block dark:text-whitish">
                Following
              </h2>
              {user && noAuctions && (
                <p className="dark:text-gray-100">
                  There&apos;s currently no auctions by artists that you follow
                </p>
              )}
              {auctions && <FollowingAuctions auctions={auctions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
