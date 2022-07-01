import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getFeed from "/data/home/getFeed";
import Details from "/components/home/feed/Details";
import { Oval } from "react-loader-spinner";

export default function Activity({ user }) {
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();
  const [feedsSelected, setFeedsSelected] = useState([
    "bid",
    "sale",
    "won",
    "listing",
  ]);
  const [results, setResults] = useState();
  const [activity, setActivity] = useState();

  const fetchFeed = useCallback(async (user_id) => {
    let res = await getFeed(user_id);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed(user.id);
  }, [user]);

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
          <InfiniteScroll
            dataLength={infiniteScrollItems.length}
            next={fetchData}
            hasMore={infiniteScrollItems.length !== results.length}
          >
            {infiniteScrollItems.map((item, index) => (
              <div key={index} className="sm:max-w-2xl">
                <Details item={item} />
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
