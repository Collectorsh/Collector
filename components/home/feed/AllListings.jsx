import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getBuyNowFeed from "/data/home/getBuyNowFeed";
import Details from "/components/home/feed/Details";
import { Oval } from "react-loader-spinner";

export default function AllListings() {
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();
  const [activity, setActivity] = useState();

  const fetchFeed = useCallback(async () => {
    let res = await getBuyNowFeed();
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (!activity) return;

    setInfiniteScrollItems(activity.slice(0, 5));
  }, [activity]);

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      activity.slice(0, currentDisplayedItems.length + 5)
    );
  }

  return (
    <div>
      {!activity && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {infiniteScrollItems && (
        <>
          <InfiniteScroll
            dataLength={infiniteScrollItems.length}
            next={fetchData}
            hasMore={infiniteScrollItems.length !== activity.length}
          >
            {infiniteScrollItems.map((item, index) => (
              <div key={index} className="sm:max-w-2xl">
                <Details item={{ ...item, ...{ type: "listing" } }} />
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
