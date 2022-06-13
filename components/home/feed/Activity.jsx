import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getFeed from "/data/home/getFeed";
import Bid from "/components/home/feed/activity/Bid";
import Won from "/components/home/feed/activity/Won";
import Sale from "/components/home/feed/activity/Sale";
import Listing from "/components/home/feed/activity/Listing";
import cloneDeep from "lodash/cloneDeep";
import { Oval } from "react-loader-spinner";
import { ChevronUpIcon } from "@heroicons/react/outline";

export default function Activity() {
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();
  const [feedsSelected, setFeedsSelected] = useState([
    "bid",
    "sale",
    "won",
    "listing",
  ]);
  const [results, setResults] = useState();
  const [activity, setActivity] = useState();

  const fetchFeed = useCallback(async () => {
    let res = await getFeed();
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (!activity) return;

    const items = activity.filter((a) => feedsSelected.includes(a.type));
    setResults(items);
    setInfiniteScrollItems(items.slice(0, 5));
  }, [activity, feedsSelected]);

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      results.slice(0, currentDisplayedItems.length + 5)
    );
  }

  function updateSelected(type) {
    if (feedsSelected.includes(type)) {
      let clonedItems = cloneDeep(feedsSelected);
      let index = clonedItems.indexOf(type);
      clonedItems.splice(index, 1);
      setFeedsSelected(clonedItems);
    } else {
      let clonedItems = cloneDeep(feedsSelected);
      let items = clonedItems.concat(type);
      setFeedsSelected(items);
    }
  }

  function style(type) {
    let selected = feedsSelected.includes(type);
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
      {!infiniteScrollItems && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {infiniteScrollItems && (
        <>
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit pt-5 inline-block dark:text-whitish">
            Activity
          </h2>
          <h2 className="text-lg uppercase font-bold mb-2 dark:text-whitish">
            Filters
          </h2>
          <div className="mb-12">
            <button
              className={style("bid")}
              onClick={() => updateSelected("bid")}
            >
              New Bids
            </button>
            <button
              className={style("won")}
              onClick={() => updateSelected("won")}
            >
              Auctions Won
            </button>
            <button
              className={style("sale")}
              onClick={() => updateSelected("sale")}
            >
              Sales
            </button>
            <button
              className={style("listing")}
              onClick={() => updateSelected("listing")}
            >
              Listings
            </button>
          </div>
          <InfiniteScroll
            dataLength={infiniteScrollItems.length}
            next={fetchData}
            hasMore={infiniteScrollItems.length !== results.length}
          >
            {infiniteScrollItems.map((item, index) => (
              <div key={index} className="sm:max-w-2xl">
                {item.type === "won" && <Won item={item} />}
                {item.type === "bid" && <Bid item={item} />}
                {item.type === "sale" && <Sale item={item} />}
                {item.type === "listing" && <Listing item={item} />}
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
