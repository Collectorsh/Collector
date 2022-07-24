import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";
import { useLazyQuery } from "@apollo/client";
import { getAllListingsQuery } from "/queries/all_listings";
import decorateListings from "/data/listings/decorateListings";
import { roundToTwo } from "/utils/roundToTwo";
import Image from "/components/Image";
import { capitalize } from "/utils/capitalize";

const _ = require("lodash");

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [topUser, setTopUser] = useState();
  const [selected, setSelected] = useState("latest");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const [getListingsQl, { loading, error, data }] =
    useLazyQuery(getAllListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
      },
    });

    // Set listings
    let listins = res.data.nfts.filter((l) => l.listings.length > 0);
    const results = await decorateListings(listins);
    setListings([...listings, ...results]);

    const top = results.sort((a, b) => a.followers - b.followers);
    setTopUser(top[results.length - 1]);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />

        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Collector Listings
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold dark:text-white">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "latest" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("latest")}
                >
                  Latest
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "featured" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("featured")}
                >
                  Featured
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "all" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("all")}
                >
                  All
                </li>
              </ul>
            </div>
          </div>
        </div>

        {selected === "latest" && topUser && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start mb-12 pt-12">
              {listings
                .sort(
                  (a, b) =>
                    new Date(b.listings[0].createdAt) -
                    new Date(a.listings[0].createdAt)
                )
                .slice(0, 12)
                .map((nft) => (
                  <>
                    <Link href={`/nft/${nft.mintAddress}`}>
                      <a>
                        <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl border border-gray-200 dark:border-dark3">
                          {nft.listings
                            .filter((l) => l.seller === nft.owner.address)
                            .map((listing) => (
                              <div className="pb-4" key={listing.mintAddress}>
                                <Image token={nft} />
                                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 px-2">
                                  {nft.name}
                                  {nft.username && (
                                    <div className="mt-3">
                                      {nft.twitter_profile_image ? (
                                        <img
                                          src={nft.twitter_profile_image}
                                          className="w-6 h-6 mr-1 rounded-full float-left mb-4"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 mr-1 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                                      )}
                                      <div className="pt-[1px]">
                                        @{nft.username}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="clear-both font-semibold text-gray-700 dark:text-gray-300 mt-2 px-2 border-t border-gray-100 dark:border-dark1">
                                  <span className="block mt-4">
                                    ◎{" "}
                                    {listing &&
                                      roundToTwo(listing.price / 1000000000)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </a>
                    </Link>
                  </>
                ))}
            </div>
          </>
        )}

        {selected === "featured" && topUser && (
          <>
            <h2 className="text-2xl text-center font-extrabold text-black dark:text-whitish my-5">
              <Link href={`/${topUser.username}/profile`}>
                <a>{capitalize(topUser.username)}</a>
              </Link>{" "}
              &middot; {topUser.followers} Followers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start mb-12">
              {listings
                .filter((l) => l.username === topUser.username)
                .map((nft) => (
                  <>
                    <Link href={`/nft/${nft.mintAddress}`}>
                      <a>
                        <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl border border-gray-200 dark:border-dark3">
                          {nft.listings
                            .filter((l) => l.seller === nft.owner.address)
                            .map((listing) => (
                              <div className="pb-4" key={listing.mintAddress}>
                                <Image token={nft} />
                                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 px-2">
                                  {nft.name}
                                  {nft.username && (
                                    <div className="mt-3">
                                      {nft.twitter_profile_image ? (
                                        <img
                                          src={nft.twitter_profile_image}
                                          className="w-6 h-6 mr-1 rounded-full float-left mb-4"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 mr-1 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                                      )}
                                      <div className="pt-[1px]">
                                        @{nft.username}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="clear-both font-semibold text-gray-700 dark:text-gray-300 mt-2 px-2 border-t border-gray-100 dark:border-dark1">
                                  <span className="block mt-4">
                                    ◎{" "}
                                    {listing &&
                                      roundToTwo(listing.price / 1000000000)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </a>
                    </Link>
                  </>
                ))}
            </div>
          </>
        )}

        {selected === "all" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start mb-12 pt-12">
            {listings.map((nft) => (
              <>
                <Link href={`/nft/${nft.mintAddress}`}>
                  <a>
                    <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl border border-gray-200 dark:border-dark3">
                      {nft.listings
                        .filter((l) => l.seller === nft.owner.address)
                        .map((listing) => (
                          <div className="pb-4" key={listing.mintAddress}>
                            <Image token={nft} />
                            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 px-2">
                              {nft.name}
                              {nft.username && (
                                <div className="mt-3">
                                  {nft.twitter_profile_image ? (
                                    <img
                                      src={nft.twitter_profile_image}
                                      className="w-6 h-6 mr-1 rounded-full float-left mb-4"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 mr-1 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                                  )}
                                  <div className="pt-[1px]">
                                    @{nft.username}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="clear-both font-semibold text-gray-700 dark:text-gray-300 mt-2 px-2 border-t border-gray-100 dark:border-dark1">
                              <span className="block mt-4">
                                ◎{" "}
                                {listing &&
                                  roundToTwo(listing.price / 1000000000)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </a>
                </Link>
              </>
            ))}
          </div>
        )}

        {/* {usernames && (
          <>
            {usernames.map((user) => (
              <>
                <h2 className="text-2xl font-extrabold text-black dark:text-whitish my-5">
                  <Link href={`/${user.username}/profile`}>
                    <a>{user.username}</a>
                  </Link>{" "}
                  &middot; {user.count} listings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start mb-12">
                  {listings.map((nft) => (
                    <>
                      {nft.listings.find(
                        (l) => l.username === user.username
                      ) && (
                        <Link href={`/nft/${nft.mintAddress}`}>
                          <a>
                            <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3">
                              {nft.listings
                                .filter((l) => l.seller === nft.owner.address)
                                .map((listing) => (
                                  <div
                                    className="rounded-lg overflow-hidden pb-4"
                                    key={listing.mintAddress}
                                  >
                                    <Image token={nft} />
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 mt-2">
                                      {nft.name}
                                      <span className="float-right">
                                        ◎{" "}
                                        {listing &&
                                          roundToTwo(
                                            listing.price / 1000000000
                                          )}
                                      </span>
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </a>
                        </Link>
                      )}
                    </>
                  ))}
                </div>
              </>
            ))}
          </>
        )} */}

        {/* {listings && listings.length > 0 && (
          <div className="mt-10">
            <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
              Listings
            </h2>

            <div className="flex flex-wrap gap-8">
              <GridView
                items={listings}
                type="collector_listing"
                showOffers={true}
              />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
