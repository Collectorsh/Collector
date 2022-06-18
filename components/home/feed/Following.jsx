import React, { useState, useEffect, useCallback, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getFeedFollowing from "/data/home/getFeedFollowing";
import Details from "/components/home/feed/Details";
import { Oval } from "react-loader-spinner";
import UserContext from "/contexts/user";
import FeedFilters from "/components/home/feed/filters/FeedFilters";
import { updateFeedsSelected } from "/utils/updateFeedsSelected";

export default function Following() {
  const [activity, setActivity] = useState();
  const [user] = useContext(UserContext);
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();
  const [feedsSelected, setFeedsSelected] = useState([
    "bid",
    "sale",
    "won",
    "listing",
  ]);
  const [results, setResults] = useState();

  const fetchFeed = useCallback(async (apiKey) => {
    let res = await getFeedFollowing(apiKey);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFeed(user.api_key);
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

  function updateSelected(type) {
    const selected = updateFeedsSelected(type, feedsSelected);
    setFeedsSelected(selected);
  }

  return (
    <div>
      {!user && (
        <p className="dark:text-whitish">
          You need to sign-in to see your feed.
        </p>
      )}
      {!infiniteScrollItems && user && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {infiniteScrollItems && (
        <>
          {infiniteScrollItems.length > 0 && (
            <>
              <h2 className="text-5xl font-extrabold mb-8 text-black w-fit pt-5 inline-block dark:text-whitish">
                Following
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
                    <Details item={item} />
                  </div>
                ))}
              </InfiniteScroll>
            </>
          )}
        </>
      )}
    </div>
  );
}
