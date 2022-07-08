import React, { useState, useCallback, useEffect } from "react";
import GridView from "/components/GridView";
import { useLazyQuery } from "@apollo/client";
import { getListingsQuery } from "/queries/listings";

export default function Listings({ user }) {
  const [listings, setListings] = useState();

  const [getListingsQl, { loading, error, data }] =
    useLazyQuery(getListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
        owners: user.public_keys,
      },
    });
    let listins = res.data.nfts.filter((l) => l.listings.length > 0);
    setListings(listins);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      {listings && (
        <div className="mt-10">
          <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
            Listings
          </h2>

          <div className="flex flex-wrap gap-8">
            <GridView items={listings} type="listing" />
          </div>
        </div>
      )}
    </>
  );
}
