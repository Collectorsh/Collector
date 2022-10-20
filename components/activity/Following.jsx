import React, { useState, useEffect, useCallback, useContext } from "react";
import FollowingAuctions from "/components/activity/FollowingAuctions";
import getFollowingAuctions from "/data/artists/getFollowingAuctions";
import getAuctions from "/data/home/getAuctions";
import ArtistFilter from "/components/activity/ArtistFilter";
import UserContext from "/contexts/user";
import { Oval } from "react-loader-spinner";
import { sortAuctions } from "/utils/sortHelper";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Following() {
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);
  const [user] = useContext(UserContext);
  const [auctions, setAuctions] = useState([]);
  const [noAuctions, setNoAuctions] = useState(false);
  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState("following");
  const [sortBy, setSortBy] = useState("az");

  const filteredResults = (r) => {
    setResults(r);
  };

  useEffect(() => {
    setInfiniteScrollItems(results.slice(0, 20));
  }, [results]);

  const initFollowingAuctions = useCallback(async (user) => {
    if (!user) return;

    let res = await getFollowingAuctions(user.api_key);
    setLoaded(true);
    if (res.status === "success" && res.auctions.length > 0) {
      const response = sortAuctions(sortBy, res.auctions);
      setAuctions(response);
      setResults(response);
      setLoaded(true);
    } else {
      setNoAuctions(true);
    }
  }, []);

  const initAllAuctions = useCallback(async () => {
    let res = await getAuctions();
    setLoaded(true);
    if (res.data.length > 0) {
      const response = sortAuctions(sortBy, res.data);
      setAuctions(response);
      setResults(response);
      setLoaded(true);
    } else {
      setNoAuctions(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    initFollowingAuctions(user);
  }, [user]);

  function toggleSource(s) {
    setSource(s);
    setLoaded(false);
    if (s === "following") {
      initFollowingAuctions(user);
    } else if (s === "all") {
      initAllAuctions();
    }
  }

  function toggleSort(s) {
    setSortBy(s);
    const response = sortAuctions(s, results);
    setInfiniteScrollItems(response.slice(0, 20));
    setResults(response);
  }

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      results.slice(0, currentDisplayedItems.length + 20)
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-4 md:pt-8">
      <div className="md:col-span-3 md:pr-8">
        <ArtistFilter allResults={auctions} filteredResults={filteredResults} />
        <div className="my-6 w-full clear-both">
          <div className="flex justify-left">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                onClick={() => toggleSource("following")}
                defaultChecked={source === "following"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="inlineRadio10"
              >
                Following
              </label>
            </div>
            <div className="form-check form-check-inline ml-6">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                onClick={() => toggleSource("all")}
                defaultChecked={source === "all"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="inlineRadio20"
              >
                All Auctions
              </label>
            </div>
          </div>
        </div>
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
                defaultChecked={sortBy === "az"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &uarr;{" "}
                <span className="text-gray-300 dark:text-dark3">[a-z]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("za")}
                defaultChecked={sortBy === "za"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Artist &darr;{" "}
                <span className="text-gray-300 dark:text-dark3">[z-a]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("lh")}
                defaultChecked={sortBy === "lh"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &uarr;{" "}
                <span className="text-gray-300 dark:text-dark3">[lowest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("hl")}
                defaultChecked={sortBy === "hl"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Price &darr;{" "}
                <span className="text-gray-300 dark:text-dark3">[highest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("endasc")}
                defaultChecked={sortBy === "endasc"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Ending &uarr;{" "}
                <span className="text-gray-300 dark:text-dark3">[soonest]</span>
              </label>
            </div>
            <div className="py-1">
              <input
                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={() => toggleSort("enddesc")}
                defaultChecked={sortBy === "enddesc"}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-whitish"
                htmlFor="flexRadioDefault2"
              >
                Ending &darr;{" "}
                <span className="text-gray-300 dark:text-dark3">
                  [farthest]
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="clear-both my-4 h-[1px] w-full bg-gray-200 dark:bg-dark3"></div>
      </div>
      <div className="md:col-span-9">
        <div className="mb-12">
          <div className="w-full mb-6">
            {user && noAuctions && (
              <p className="dark:text-gray-100">
                There&apos;s currently no auctions
              </p>
            )}
            {loaded ? (
              <InfiniteScroll
                dataLength={infiniteScrollItems.length}
                next={fetchData}
                hasMore={infiniteScrollItems.length !== results.length}
              >
                <FollowingAuctions auctions={infiniteScrollItems} user={user} />
              </InfiniteScroll>
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
  );
}
