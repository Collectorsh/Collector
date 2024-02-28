import React, { useState, useEffect, useCallback, useContext } from "react";
import getMostWins from "/data/home/getMostWins";
import getMarketplaceStats from "/data/home/getMarketplaceStats";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { numberWithCommas } from "/utils/numberWithCommas";

export default function RightColumn() {
  const [mostWins, setMostWins] = useState();
  const [marketplaceStats, setMarketplaceStats] = useState();

  const fetchMostWins = useCallback(async () => {
    let res = await getMostWins();
    setMostWins(res.data);
  }, []);

  const fetchMarketplaceStats = useCallback(async () => {
    let res = await getMarketplaceStats();
    setMarketplaceStats(res.data);
  }, []);

  useEffect(() => {
    fetchMostWins();
    fetchMarketplaceStats();
  }, []);

  function transactionName(type) {
    var transName;
    switch (type) {
      case "auction":
        transName = "Auctions";
        break;
      case "buy":
        transName = "Instant Sales";
        break;
      case "edition":
        transName = "Editions";
        break;
      case "offer":
        transName = "Offers";
        break;
    }
    return transName;
  }

  function calculateTotal(item) {
    var totalAmount = 0.0;
    item.results.map((r) => {
      totalAmount += Number(r.total);
    });
    return totalAmount;
  }

  return (
    <>
      {mostWins && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Last 7 days
          </h2>
          {mostWins.map((item, index) => (
            <div key={index} className="mt-4">
              <div className="float-left w-11/12">
                {item.user.twitter_profile_image ? (
                  <img
                    src={item.user.twitter_profile_image}
                    className="w-12 h-12 mr-2 rounded-full float-left mb-4"
                  />
                ) : (
                  <div className="w-12 h-12 mr-2 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                )}

                <div className="mb-0">
                  {item.user.username && (
                    <p className="inline mr-2">
                      <CollectorUsername username={item.user.username} />
                    </p>
                  )}
                </div>
                <p className="text-sm dark:text-whitish">
                  {item.wins} auctions won
                </p>
              </div>
              <div className="clear-both"></div>
            </div>
          ))}
        </div>
      )}

      {marketplaceStats && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2 mt-6">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Marketplaces 7 days
          </h2>
          {marketplaceStats.map((item, index) => (
            <div key={index} className="mt-4">
              <MarketplaceLogo source={item.name} />
              <dl className="mt-4">
                {item.results.map((result, index) => (
                  <div key={index}>
                    <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-neutral-500">
                        {transactionName(result.type)}
                      </dt>
                      <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-300 sm:mt-0 sm:col-span-1">
                        {numberWithCommas(result.count)}
                      </dd>
                      <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-300 sm:mt-0 sm:col-span-1">
                        ◎
                        {numberWithCommas(
                          roundToTwo(result.total / 1000000000)
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
                <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Volume</dt>
                  <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-300 sm:mt-0 sm:col-span-1 sm:col-start-3">
                    ◎
                    {numberWithCommas(
                      roundToTwo(calculateTotal(item) / 1000000000)
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
