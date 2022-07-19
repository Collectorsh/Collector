import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import ListingsContext from "/contexts/listings";
import { sortHighestOffer } from "/utils/sortHighestOffer";

export default function Offers({ token }) {
  const [listings] = useContext(ListingsContext);
  const [offer, setOffer] = useState();

  useEffect(() => {
    if (!token.mint && token.mintAddress) token.mint = token.mintAddress;
    let item = listings.filter((l) => l.mintAddress === token.mint)[0];
    if (!item) return;
    let highest = sortHighestOffer(item.offers);
    setOffer(highest);
  }, [listings]);

  return (
    <div>
      {offer && (
        <Link href={`/nft/${token.mint}`} title="">
          <a>
            <div className="text-sm cursor-pointer text-dark3 dark:text-gray-300 bg-whitish dark:bg-dark3 w-fit px-2 py-1 rounded cursor-pointer absolute top-3 left-3">
              Offer ◎{roundToTwo(offer.price / 1000000000)}
            </div>
          </a>
        </Link>
      )}
    </div>
  );
}
