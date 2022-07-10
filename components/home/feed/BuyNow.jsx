import React, { useEffect, useState, useCallback } from "react";
import GridView from "/components/GridView";
import { useLazyQuery } from "@apollo/client";
import { getAllListingsQuery } from "/queries/all_listings";
import getListingUsernames from "/data/listings/getListingUsernames";
import { Oval } from "react-loader-spinner";

export default function BuyNow() {
  const [listings, setListings] = useState();

  const [getAllListingsQl, { loading, error, data }] =
    useLazyQuery(getAllListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getAllListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
      },
    });
    const results = await getListingUsernames(res.data.nfts);
    setListings(results);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div>
      <div className="mb-12">
        {!listings && (
          <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
            <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
          </div>
        )}
        {listings && (
          <>
            <GridView items={listings} type="listing" />
          </>
        )}
      </div>
    </div>
  );
}
