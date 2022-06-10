import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import ListingsContext from "/contexts/listings";
import { sortHighestListing } from "/utils/sortHighestListing";

export default function Listings({ token }) {
  const [listings] = useContext(ListingsContext);
  const [listing, setListing] = useState();

  useEffect(() => {
    let item = listings.filter((l) => l.mintAddress === token.mint)[0];
    if (!item) return;
    let highest = sortHighestListing(token, item.listings);
    setListing(highest);
  }, [listings]);

  return (
    <>
      {listing && (
        <Link href={`/nft/${token.mint}`} title="">
          <a>
            <div className="rounded-[100px] backdrop-blur-lg bg-white/60 px-4 py-2 font-semibold cursor-pointer absolute top-3 right-3">
              Buy Now ◎{roundToTwo(listing.price / 1000000000)}
            </div>
          </a>
        </Link>
      )}
    </>
  );
}
