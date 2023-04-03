import React, { useState, useEffect, useContext } from "react";
import artistFollowSearch from "/data/artists/artistFollowSearch";
import followArtist from "/data/artists/followArtist";
import { Oval } from "react-loader-spinner";
import { success } from "/utils/toast";
import UserContext from "/contexts/user";
import FollowingContext from "/contexts/following";

function ArtistSearch() {
  const [user] = useContext(UserContext);
  const [, setFollowing] = useContext(FollowingContext);
  const [results, setResults] = useState();
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setResults();
      setSearching(false);
    } else {
      doSearch();
    }
  }, [searchTerm]);

  const doSearch = async () => {
    setSearching(true);
    let res = await artistFollowSearch(user.api_key, searchTerm);
    setResults(res.results);
    setSearching(false);
  };

  const doFollow = async (artist) => {
    setResults();
    setSearching(false);
    setSearchTerm("");
    const res = await followArtist(user.api_key, artist);
    if (res.status === "success") {
      setFollowing(res.following);
      success("You followed " + artist);
    }
  };

  return (
    <div className="relative -mt-1">
      <form id="search" onSubmit={doSearch} className="w-fit border">
        <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-100 sm:text-sm ml-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#aaa"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M21.0004 20.9999L16.6504 16.6499"
                stroke="#aaa"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
        <input
          type="text"
          id="query"
          name="query"
          placeholder="Find artists to follow"
          className="pl-10 md:w-[400px] lg:w-[500px] pr-4 py-3 block border-none border search w-full outline-none text-gray-800 dark:text-gray-300 placeholder-gray-400 bg-transparent rounded-3xl"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </form>
      {(searching || results) && (
        <div className="min-h-[100px] w-[500px] bg-gray-100 dark:bg-dark3 absolute z-10 text-left p-4 rounded-b-lg">
          {searching ? (
            <div className="w-[40px] ml-[175px] mt-[15px]">
              <Oval color="#000" secondaryColor="#fff" height={30} width={30} />
            </div>
          ) : (
            <ul className="leading-10">
              {results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="group cursor-pointer hover:text-black dark:hover:text-white hover:font-bold"
                      onClick={(e) => doFollow(result.name)}
                    >
                      {result.name}
                      {result.twitter && (
                        <span className="ml-6 text-gray-600">
                          {result.twitter}
                        </span>
                      )}
                      <span className="float-right text-green-500 hidden group-hover:inline-block">
                        follow
                      </span>
                    </li>
                  ))}
                </>
              ) : (
                <li>No results found</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ArtistSearch;
