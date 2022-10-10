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

  const toggleSort = (s) => {
    setSortBy(s);
    const response = sortListings(s, results);
    setResults(response);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-4 md:pt-8">
      <div className="md:col-span-3 md:pr-8">
        <ArtistFilter allResults={listings} filteredResults={filteredResults} />
        <h1 className="font-sans border-t border-b border-gray-200 dark:border-dark3 py-2 mt-8">
          Sort By
        </h1>
        <div className="flex mt-2">
          <div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("az")}
                checked={sortBy === "az"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &uarr;
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("za")}
                checked={sortBy === "za"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &darr;
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("lh")}
                checked={sortBy === "lh"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &uarr;
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("hl")}
                checked={sortBy === "hl"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &darr;
              </label>
            </div>
            {user && user.token_holder && (
              <div className="py-1">
                <input
                  className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  onClick={() => toggleSort("deals")}
                  checked={sortBy === "deals"}
                />
                <label
                  className="form-check-label inline-block text-gray-800 dark:text-whitish"
                  htmlFor="flexRadioDefault1"
                >
                  Best Deals
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="clear-both my-4 h-[1px] w-full bg-gray-200 dark:bg-dark3"></div>
      </div>
      <div className="md:col-span-9">
        {user && noListings && (
          <p className="dark:text-gray-100">
            There&apos;s currently no listings by artists that you follow
          </p>
        )}
        <BuynowListings listings={results} user={user} />
      </div>
    </div>
  );
}
