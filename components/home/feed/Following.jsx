import React, { useState, useEffect, useCallback, useContext } from "react";
import getFeedFollowing from "/data/home/getFeedFollowing";
import Bid from "/components/home/feed/activity/Bid";
import Won from "/components/home/feed/activity/Won";
import Sale from "/components/home/feed/activity/Sale";
import Listing from "/components/home/feed/activity/Listing";
import { Oval } from "react-loader-spinner";
import UserContext from "/contexts/user";

export default function Following() {
  const [activity, setActivity] = useState();
  const [bidSelected, setBidSelected] = useState(true);
  const [wonSelected, setWonSelected] = useState(true);
  const [saleSelected, setSaleSelected] = useState(true);
  const [listingSelected, setListingSelected] = useState(true);
  const [user] = useContext(UserContext);

  const fetchFeed = useCallback(async (apiKey) => {
    let res = await getFeedFollowing(apiKey);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFeed(user.api_key);
  }, [user]);

  function style(selected) {
    let styles;
    if (selected) {
      styles =
        "bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish";
    } else {
      styles = "dark:text-whitish";
    }
    styles +=
      " cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4 mb-2";
    return styles;
  }

  return (
    <div>
      {!user && (
        <p className="dark:text-whitish">
          You need to sign-in to see your feed.
        </p>
      )}
      {!activity && user && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {activity && (
        <>
          {activity.length > 0 ? (
            <>
              <h2 className="text-5xl font-extrabold mb-8 text-black w-fit pt-5 inline-block dark:text-whitish">
                Following
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
          ) : (
            <p className="dark:text-whitish">
              You aren&apos;t following anybody. You can follow Collector&apos;s
              on their gallery page.
            </p>
          )}
        </>
      )}
    </div>
  );
}
