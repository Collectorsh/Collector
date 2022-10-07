import React, { useEffect, useContext, useCallback, useState } from "react";
import Card from "/components/gallery/Card";
import getExchangeOffers from "/data/getExchangeOffers";
import Masonry from "react-masonry-css";
import { roundToTwo } from "/utils/roundToTwo";
import ExchangeOffersContext from "/contexts/exchange_offers";
import EstimatedValueContext from "/contexts/estimated_value";

export default function GalleryContainer({ tokens, user }) {
  const [exchangeOffers, setExchangeOffers] = useContext(ExchangeOffersContext);
  const [runningTotal, setRunningTotal] = useState(0);
  const [totalEstimate, setTotalEstimate] = useContext(EstimatedValueContext);

  const fetchExchangeOffers = useCallback(async () => {
    try {
      const res = await getExchangeOffers(user.public_keys);
      setExchangeOffers([...exchangeOffers, ...res]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchExchangeOffers();
  }, [user]);

  useEffect(() => {
    let total = totalEstimate.reduce((a, b) => a + (b["estimate"] || 0), 0);
    setRunningTotal(total);
  }, [totalEstimate]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="clear-both w-full mt-6">
      {user && user.estimated_value && user.token_holder && (
        <div className="pb-8">
          <h2 className="text-base text-lg font-semibold leading-4 text-black dark:text-white inline">
            Estimated: ◎{roundToTwo(runningTotal / 1000000000)}
          </h2>
        </div>
      )}
      <div className="clear-both">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {Array.isArray(tokens) &&
            tokens.map((token, index) => {
              if (token.visible)
                return <Card key={index} token={token} user={user} />;
            })}
        </Masonry>
      </div>
    </div>
  );
}
