import React, { useState, useEffect, useCallback, useContext } from "react";
import FollowingAuctions from "/components/activity/FollowingAuctions";
import getFollowingAuctions from "/data/artists/getFollowingAuctions";
import ArtistFilter from "/components/activity/ArtistFilter";
import UserContext from "/contexts/user";
import { Oval } from "react-loader-spinner";

export default function Following() {
  const [user] = useContext(UserContext);
  const [auctions, setAuctions] = useState([]);
  const [noAuctions, setNoAuctions] = useState(false);
  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const filteredResults = (r) => {
    setResults(r);
  };

  const initFollowingAuctions = useCallback(async (user) => {
    let res = await getFollowingAuctions(user.api_key);
    setLoaded(true);
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
    <div className="pt-6">
      <ArtistFilter allResults={auctions} filteredResults={filteredResults} />
      <div>
        <div>
          <div className="mb-12">
            <div className="w-full mt-16 mb-6">
              {user && noAuctions && (
                <p className="dark:text-gray-100">
                  There&apos;s currently no auctions by artists that you follow
                </p>
              )}
              {loaded ? (
                <FollowingAuctions auctions={results} />
              ) : (
                <div className="mt-4 w-[50px] mx-auto h-64">
                  <Oval
                    color="#fff"
                    secondaryColor="#000"
                    height={50}
                    width={50}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}