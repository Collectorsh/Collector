import React, { useState, useEffect, useCallback, useContext } from "react";
import BuynowListings from "/components/activity/BuynowListings";
import getFollowingBuynow from "/data/artists/getFollowingBuynow";
import getSignatureListings from "/data/signature/getSignatureListings";
import ArtistFilter from "/components/activity/ArtistFilter";
import UserContext from "/contexts/user";
import { sortListings } from "/utils/sortHelper";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Following() {
  const [user] = useContext(UserContext);
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);
  const [listings, setListings] = useState([]);
  const [noListings, setNoListings] = useState(false);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("az");
  const [source, setSource] = useState("following");
  const [loaded, setLoaded] = useState(false);

  const filteredResults = (r) => {
    setResults(r);
  };

  const initFollowingBuynow = useCallback(async (user, sortBy) => {
    let res = await getFollowingBuynow(user.api_key);
    if (res.status === "success" && res.listings.length > 0) {
      const response = sortListings(sortBy, res.listings);
      setListings(response);
      setResults(response);
      setLoaded(true);
    } else {
      setNoListings(true);
    }
  }, []);

  const initSignatureListings = useCallback(async (sortBy) => {
    let res = await getSignatureListings();
    if (res.status === "success" && res.listings.length > 0) {
      const response = sortListings(sortBy, res.listings);
      setListings(response);
      setResults(response);
      setLoaded(true);
    } else {
      setNoListings(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingBuynow(user, "az");
  }, [user]);

  useEffect(() => {
    setInfiniteScrollItems(results.slice(0, 20));
  }, [results]);

  function toggleSort(s) {
    setInfiniteScrollItems([]);
    setSortBy(s);
    const response = sortListings(s, results);
    setResults(response);
  }

  function toggleSource(s) {
    setSource(s);
    setLoaded(false);
    if (s === "following") {
      initFollowingBuynow(user, sortBy);
    } else if (s === "holders") {
      initSignatureListings(sortBy);
    }
  }

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      results.slice(0, currentDisplayedItems.length + 20)
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-4 md:pt-8">
      <div className="md:col-span-3 md:pr-8">
        <ArtistFilter allResults={listings} filteredResults={filteredResults} />
        <div className="my-6 w-full clear-both">
          <div className="flex justify-left">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                onClick={() => toggleSource("following")}
                defaultChecked={source === "following"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="inlineRadio10"
              >
                Following
              </label>
            </div>
            <div className="form-check form-check-inline ml-6">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                onClick={() => toggleSource("holders")}
                defaultChecked={source === "holders"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="inlineRadio20"
              >
                Signature Holders
              </label>
            </div>
          </div>
        </div>
        <h1 className="font-sans border-t border-b border-neutral-200 dark:border-dark3 py-2 mt-8">
          Sort By
        </h1>
        <div className="flex mt-2">
          <div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("az")}
                defaultChecked={sortBy === "az"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &uarr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[a-z]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("za")}
                defaultChecked={sortBy === "za"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &darr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[z-a]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("lh")}
                defaultChecked={sortBy === "lh"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &uarr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[lowest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("hl")}
                defaultChecked={sortBy === "hl"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &darr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[highest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("asc")}
                defaultChecked={sortBy === "asc"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Date &uarr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[oldest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-neutral-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("desc")}
                defaultChecked={sortBy === "desc"}
              />
              <label
                className="form-check-label inline-block text-neutral-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Date &darr;{" "}
                <span className="text-neutral-300 dark:text-dark3">[newest]</span>
              </label>
            </div>
          </div>
        </div>
        <div className="clear-both my-4 h-[1px] w-full bg-neutral-200 dark:bg-dark3"></div>
      </div>
      <div className="md:col-span-9">
        {user && noListings && (
          <p className="dark:text-neutral-100">
            There&apos;s currently no listings by artists that you follow
          </p>
        )}
        {loaded && infiniteScrollItems.length > 0 ? (
          <InfiniteScroll
            dataLength={infiniteScrollItems.length}
            next={fetchData}
            hasMore={infiniteScrollItems.length !== results.length}
          >
            <BuynowListings listings={infiniteScrollItems} user={user} />
          </InfiniteScroll>
        ) : (
          <div className="mt-4 w-[50px] mx-auto h-64">
            <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
          </div>
        )}
      </div>
    </div>
  );
}
