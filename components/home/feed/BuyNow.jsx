import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getBuyNowFeed from "/data/home/getBuyNowFeed";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";

export default function BuyNow() {
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
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit pt-5 inline-block dark:text-whitish">
            All Listings
          </h2>
          <InfiniteScroll
            dataLength={infiniteScrollItems.length}
            next={fetchData}
            hasMore={infiniteScrollItems.length !== activity.length}
          >
            {infiniteScrollItems.map((item, index) => (
              <div key={index} className="mb-12 sm:max-w-2xl">
                <p className="text-md dark:text-whitish overflow-hidden">
                  <Link
                    href={marketplaceLink(
                      item.attributes.source,
                      item.attributes.mint,
                      item.attributes.brand_name,
                      item.attributes.highest_bidder_username
                    )}
                  >
                    <a className="font-bold">{item.attributes.name}</a>
                  </Link>
                  {item.attributes.artist_name && (
                    <span>
                      {" "}
                      by <strong>{item.attributes.artist_name}</strong>{" "}
                    </span>
                  )}{" "}
                  was listed on {item.attributes.source}
                  {item.attributes.amount && (
                    <> for ◎{roundToTwo(item.attributes.amount / 1000000000)}</>
                  )}
                </p>
                <p className="text-xs mt-1 mb-1 text-gray-400 dark:text-whitish clear-both">
                  <Moment date={item.time} unix fromNow />
                  <span className="float-right">Listing</span>
                </p>
                <Link
                  href={marketplaceLink(
                    item.attributes.source,
                    item.attributes.mint,
                    item.attributes.artist_name,
                    item.attributes.highest_bidder_username
                  )}
                >
                  <a>
                    <Image token={item.attributes} size="large" />
                  </a>
                </Link>
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
