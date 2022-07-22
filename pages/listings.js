import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";
import { useLazyQuery } from "@apollo/client";
import { getAllListingsQuery } from "/queries/all_listings";
import getListingUsernames from "/data/listings/getListingUsernames";
import { roundToTwo } from "/utils/roundToTwo";
import Image from "/components/Image";

const _ = require("lodash");

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [usernames, setUsernames] = useState();

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
    const results = await getListingUsernames(listins);
    setListings([...listings, ...results]);

    // Sort by usernames
    const usernames = results
      .map((nft) => nft.listings.map((l) => l.username))
      .flat();

    const distinct = _.compact(usernames);
    const counts = [];

    for (const user of distinct) {
      let u = counts.find((c) => c.username === user);
      if (u) {
        u.count += 1;
      } else {
        counts.push({ username: user, count: 1 });
      }
    }
    const sorted = counts.sort((a, b) => b.count - a.count);
    setUsernames(sorted);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />

        {usernames && (
          <>
            {usernames.map((user) => (
              <>
                <h2 className="text-2xl font-extrabold text-white dark:text-blck my-5">
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
        )}

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
