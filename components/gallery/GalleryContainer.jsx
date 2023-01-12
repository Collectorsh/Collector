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
    // fetchExchangeOffers();
  }, [user]);

  useEffect(() => {
    let total = totalEstimate.reduce((a, b) => a + (b["estimate"] || 0), 0);
    setRunningTotal(total);
  }, [totalEstimate]);

  const breakpointColumnsObj = {
    default: user.columns,
    1100: user.columns - 1,
    700: user.columns - 2,
  };

  return (
    <div className="clear-both w-full mt-6">
      {user && user.estimated_value && (
        <div className="pb-8">
          <h2 className="text-base text-lg font-semibold leading-4 text-black dark:text-white inline">
            Estimated: ◎{roundToTwo(runningTotal / 1000000000)}
          </h2>
        </div>
      )}
      <div className="clear-both">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={`masonry-grid ${user.columns === 3 && "-ml-16"} ${
            user.columns === 4 && "-ml-10"
          } ${user.columns === 5 && "-ml-8"}`}
          columnClassName={`masonry-grid_column ${
            user.columns === 3 && "pl-16"
          } ${user.columns === 4 && "pl-10"} ${user.columns === 5 && "pl-8"}`}
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
