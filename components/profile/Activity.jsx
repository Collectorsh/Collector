import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Details from "/components/home/feed/Details";

export default function Activity({ activity }) {
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();
  const [results, setResults] = useState();

  useEffect(() => {
    if (!activity) return;

    setResults(activity);
    setInfiniteScrollItems(activity.slice(0, 5));
  }, [activity]);

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      results.slice(0, currentDisplayedItems.length + 5)
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-5xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
        Activity
      </h2>
      {infiniteScrollItems && (
        <>
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
