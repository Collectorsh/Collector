import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getFeed from "/data/home/getFeed";
import Bid from "/components/home/feed/activity/Bid";
import Won from "/components/home/feed/activity/Won";
import Sale from "/components/home/feed/activity/Sale";
import Listing from "/components/home/feed/activity/Listing";
import { Oval } from "react-loader-spinner";
import FeedFilters from "/components/home/feed/filters/FeedFilters";
import { updateFeedsSelected } from "/utils/updateFeedsSelected";

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
    const selected = updateFeedsSelected(type, feedsSelected);
    setFeedsSelected(selected);
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
          <FeedFilters
            updateSelected={updateSelected}
            feedsSelected={feedsSelected}
          />
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
