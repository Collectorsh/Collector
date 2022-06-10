import React, { useState, useEffect, useCallback } from "react";
import getBuyNowFeed from "/data/home/getBuyNowFeed";
import { Oval } from "react-loader-spinner";
import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";

export default function BuyNow() {
  const [activity, setActivity] = useState();

  const fetchFeed = useCallback(async () => {
    let res = await getBuyNowFeed();
    console.log(res.data);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

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
            Buy Now
          </h2>
          {activity.map((item, index) => (
            <div key={index} className="mb-12 sm:max-w-2xl">
              <p className="text-md dark:text-whitish overflow-hidden">
                <Link
                  href={marketplaceLink(
                    item.attributes.marketplace,
                    item.attributes.mint,
                    item.attributes.brand_name,
                    item.attributes.highest_bidder_username
                  )}
                >
                  <a className="font-bold">{item.attributes.name}</a>
                </Link>
                {item.attributes.artist_name && (
                  <span> by {item.attributes.artist_name} </span>
                )}{" "}
                was listed on {item.attributes.marketplace} for ◎
                {roundToTwo(item.attributes.amount / 1000000000)}
              </p>
              <p className="text-xs mt-1 mb-1 text-gray-400 dark:text-whitish clear-both">
                <Moment date={item.time} unix fromNow />
                <span className="float-right">Listing</span>
              </p>
              <Link
                href={marketplaceLink(
                  item.attributes.marketplace,
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
        </>
      )}
    </div>
  );
}
