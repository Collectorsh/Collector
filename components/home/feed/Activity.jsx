import React, { useState, useEffect, useCallback } from "react";
import getFeed from "/data/home/getFeed";
import Bid from "/components/home/feed/activity/Bid";
import Won from "/components/home/feed/activity/Won";
import Sale from "/components/home/feed/activity/Sale";
import Listing from "/components/home/feed/activity/Listing";
import { Oval } from "react-loader-spinner";

export default function Activity() {
  const [activity, setActivity] = useState();
  const [bidSelected, setBidSelected] = useState(true);
  const [wonSelected, setWonSelected] = useState(true);
  const [saleSelected, setSaleSelected] = useState(true);
  const [listingSelected, setListingSelected] = useState(true);

  const fetchFeed = useCallback(async () => {
    let res = await getFeed();
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  function style(selected) {
    let styles;
    if (selected) {
      styles =
        "bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish";
    } else {
      styles = "dark:text-whitish";
    }
    styles +=
      " cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4";
    return styles;
  }

  return (
    <div>
      {!activity && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {activity && (
        <>
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit pt-5 inline-block dark:text-whitish">
            Activity
          </h2>
          <h2 className="text-lg uppercase font-bold mb-2 dark:text-whitish">
            Filters
          </h2>
          <div className="mb-12">
            <button
              className={style(bidSelected)}
              onClick={() => setBidSelected(!bidSelected)}
            >
              New Bids
            </button>
            <button
              className={style(wonSelected)}
              onClick={() => setWonSelected(!wonSelected)}
            >
              Auctions Won
            </button>
            <button
              className={style(saleSelected)}
              onClick={() => setSaleSelected(!saleSelected)}
            >
              Sales
            </button>
            <button
              className={style(listingSelected)}
              onClick={() => setListingSelected(!listingSelected)}
            >
              Listings
            </button>
          </div>
          {activity.map((item, index) => (
            <div key={index} className="sm:max-w-2xl">
              {item.type === "won" && wonSelected && <Won item={item} />}
              {item.type === "bid" && bidSelected && <Bid item={item} />}
              {item.type === "sale" && saleSelected && <Sale item={item} />}
              {item.type === "listing" && listingSelected && (
                <Listing item={item} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
