import React, { useState, useCallback, useEffect } from "react";
import GridView from "/components/GridView";
import getUserListings from "/data/listings/getUserListings";

export default function Listings({ user }) {
  const [listings, setListings] = useState();

  const fetchListings = useCallback(async () => {
    const res = await getUserListings(user.id);
    setListings(res.data.listings);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      {listings && listings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white">
            Listings
          </h2>
          <div className="w-full border-b border-neutral-200 dark:border-dark3 mt-3 mb-6"></div>
          <div className="flex flex-wrap gap-8">
            <GridView items={listings} type="listing" />
          </div>
        </div>
      )}
    </>
  );
}
