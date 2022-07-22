import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import ListingsContext from "/contexts/listings";
import { sortHighestOffer } from "/utils/sortHighestOffer";

export default function Offers({ token }) {
  const [listings] = useContext(ListingsContext);
  const [offer, setOffer] = useState();

  const getMint = (token) => {
    var mint;
    if (token.mint) {
      mint = token.mint;
    } else if (token.mintAddress) {
      mint = token.mintAddress;
    }
    return mint;
  };

  useEffect(() => {
    let item = listings.filter((l) => l.mintAddress === getMint(token))[0];
    if (!item) return;
    let highest = sortHighestOffer(item.offers);
    setOffer(highest);
  }, [listings]);

  return (
    <div>
      {offer && (
        <Link href={`/nft/${getMint(token)}`} title="">
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
