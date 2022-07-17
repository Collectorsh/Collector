import React, { useState, useCallback, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import { useLazyQuery } from "@apollo/client";
import { getAllListingsQuery } from "/queries/all_listings";
import GridView from "/components/GridView";

export default function Listings() {
  const [listings, setListings] = useState([]);

  const [getListingsQl, { loading, error, data }] =
    useLazyQuery(getAllListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
      },
    });
    let listins = res.data.nfts.filter((l) => l.listings.length > 0);
    setListings([...listings, ...listins]);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        {listings && listings.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
