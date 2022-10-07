import React, { useState, useEffect, useCallback, useContext } from "react";
import BuynowListings from "/components/profile/activity/BuynowListings";
import getFollowingBuynow from "/data/artists/getFollowingBuynow";
import ArtistFilter from "/components/profile/activity/ArtistFilter";
import UserContext from "/contexts/user";

export default function Following() {
  const [user] = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [noListings, setNoListings] = useState(false);
  const [results, setResults] = useState([]);

  const filteredResults = (r) => {
    setResults(r);
  };

  const initFollowingBuynow = useCallback(async (user) => {
    let res = await getFollowingBuynow(user.api_key);
    if (res.status === "success" && res.listings.length > 0) {
      setListings(res.listings);
    } else {
      setNoListings(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingBuynow(user);
  }, [user]);

  return (
    <div className="pt-6">
      <ArtistFilter allResults={listings} filteredResults={filteredResults} />
      <div>
        <div>
          <div className="mb-12">
            <div className="w-full mt-16 mb-6">
              {user && noListings && (
                <p className="dark:text-gray-100">
                  There&apos;s currently no listings by artists that you follow
                </p>
              )}
              <BuynowListings listings={results} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
