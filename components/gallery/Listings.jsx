import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import ListingsContext from "/contexts/listings";
import { sortHighestListing } from "/utils/sortHighestListing";

export default function Listings({ token }) {
  const [listings] = useContext(ListingsContext);
  const [listing, setListing] = useState();

  useEffect(() => {
    let lstngs = listings.filter((l) => l.address === token.address);
    
    if (!lstngs.length) return;
    let highest = sortHighestListing(token, lstngs);
    setListing(highest);
  }, [listings]);

  return (
    <>
      {listing && (
        <Link href={`/art/${token.mint}`} title="">
          <a>
            <div className="text-sm cursor-pointer text-dark3 dark:text-neutral-300 bg-whitish dark:bg-dark3 w-fit px-2 py-1 rounded absolute top-3 right-3">
              Buy Now ◎{roundToTwo(listing.price / 1000000000)}
            </div>
          </a>
        </Link>
      )}
    </>
  );
}
