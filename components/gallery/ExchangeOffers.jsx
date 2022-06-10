import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import ExchangeOffersContext from "/contexts/exchange_offers";

export default function ExchangeOffers({ token }) {
  const exchangeOffers = useContext(ExchangeOffersContext);
  const [offer, setOffer] = useState({});

  useEffect(() => {
    let found_offers = exchangeOffers.filter((o) => o.mint === token.mint);
    var new_offer = {};
    for (const this_offer of found_offers) {
      if (this_offer.amount > new_offer.amount || !new_offer.amount) {
        new_offer = { amount: this_offer.amount, source: this_offer.source };
      }
    }
    if (new_offer.amount) setOffer(new_offer);
  }, [exchangeOffers, token]);

  return (
    <>
      {offer && offer.source === "exchange" && (
        <div className="rounded-[100px] backdrop-blur-lg bg-white/60 px-4 py-2 font-semibold cursor-pointer absolute top-2 left-2 hover:scale-105">
          <Link href={`https://exchange.art/single/${token.mint}`} title="">
            <a>OFFER ◎{offer.amount}</a>
          </Link>
        </div>
      )}
    </>
  );
}
