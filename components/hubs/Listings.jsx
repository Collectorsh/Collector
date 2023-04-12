import React, { useContext } from "react";
import ListingsContext from "/contexts/listings";
import Listing from "/components/hubs/Listing";

export default function Listings() {
  const [listings] = useContext(ListingsContext);

  return (
    <div className="clear-both mt-6 max-w-screen-2xl mx-auto px-4 sm:px-8">
      <div className="pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
        {listings.map((listing, index) => (
          <Listing key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
}
