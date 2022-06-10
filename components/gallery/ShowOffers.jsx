import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import ListingsContext from "/contexts/listings";
import { sortHighestOffer } from "/utils/sortHighestOffer";

export default function Offers({ token }) {
  const [listings] = useContext(ListingsContext);
  const [offer, setOffer] = useState();

  useEffect(() => {
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
            <div className="rounded-[100px] backdrop-blur-lg bg-white/60 px-4 py-2 font-semibold cursor-pointer absolute top-3 left-3">
              Offer ◎{roundToTwo(offer.price / 1000000000)}
            </div>
          </a>
        </Link>
      )}
    </div>
  );
}
