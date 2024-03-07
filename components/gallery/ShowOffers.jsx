import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import React, { useState, useEffect, useContext } from "react";
import OffersContext from "/contexts/offers";
import { sortHighestOffer } from "/utils/sortHighestOffer";

export default function Offers({ token }) {
  const [offers] = useContext(OffersContext);
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
    let offs = offers.filter((l) => l.address === token.address);
    if (!offs) return;
    let highest = sortHighestOffer(offs);
    setOffer(highest);
  }, [offers]);

  return (
    <div>
      {offer && (
        <Link href={`/art/${getMint(token)}`} title="">
          <a>
            <div className="text-sm cursor-pointer text-dark3 dark:text-neutral-300 bg-whitish dark:bg-dark3 w-fit px-2 py-1 rounded cursor-pointer absolute top-3 left-3">
              Offer ◎{roundToTwo(offer.price / 1000000000)}
            </div>
          </a>
        </Link>
      )}
    </div>
  );
}
