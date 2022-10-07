import React, { useState, useEffect, useCallback, useContext } from "react";
import BuynowListings from "/components/profile/activity/BuynowListings";
import getFollowingBuynow from "/data/artists/getFollowingBuynow";
import ArtistFilter from "/components/profile/activity/ArtistFilter";
import UserContext from "/contexts/user";
import Select from "react-select";
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
      setListings(res.listings);
    } else {
      setNoListings(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingBuynow(user);
  }, [user]);

  useEffect(() => {
    const res = sortListings(sortBy, results);

    setSortedResults(res);
  }, [results, sortBy]);

  const SORT_OPTIONS = [
    { value: "az", label: "Artist A-Z" },
    { value: "za", label: "Artist Z-A" },
    { value: "deals", label: "Best Deals" },
  ];

  const onSortChange = (sortOption) => {
    if (sortOption !== null) {
      setSortBy(sortOption.value);
    } else {
      setSortBy("az");
    }
  };

  return (
    <div className="pt-6">
      <Select
        options={SORT_OPTIONS}
        onChange={onSortChange}
        placeholder="Sort By"
        isClearable={true}
        className="w-fit"
      />
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
              <BuynowListings listings={sortedResults} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
