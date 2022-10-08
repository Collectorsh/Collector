import React, { useState, useEffect, useCallback, useContext } from "react";
import BuynowListings from "/components/profile/activity/BuynowListings";
import getFollowingBuynow from "/data/artists/getFollowingBuynow";
import ArtistFilter from "/components/profile/activity/ArtistFilter";
import UserContext from "/contexts/user";
import { sortListings } from "./sortHelper";

export default function Following() {
  const [user] = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [noListings, setNoListings] = useState(false);
  const [results, setResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [sortBy, setSortBy] = useState("az");

  const filteredResults = (r) => {
    setResults(r);
  };

  const initFollowingBuynow = useCallback(async (user) => {
    let res = await getFollowingBuynow(user.api_key);
    if (res.status === "success" && res.listings.length > 0) {
      const response = sortListings("az", res.listings);
      setListings(response);
      setResults(response);
    } else {
      setNoListings(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingBuynow(user);
  }, [user]);

  const toggleDeals = () => {
    if (sortBy === "az") {
      setSortBy("deals");
      const response = sortListings("deals", results);
      setResults(response);
    } else {
      setSortBy("az");
      const response = sortListings("az", results);
      setResults(response);
    }
  };

  return (
    <div className="pt-6">
      {user && user.token_holder && (
        <button
          className={`float-right ml-6 cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4 border-black hover:bg-black hover:text-white dark:hover:bg-whitish dark:hover:text-black dark:border-whitish ${
            sortBy === "az"
              ? "bg-white text-black dark:bg-black dark:text-whitish"
              : "bg-black text-white dark:bg-whitish dark:text-black"
          }`}
          onClick={() => toggleDeals()}
        >
          Best Deals
        </button>
      )}
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
