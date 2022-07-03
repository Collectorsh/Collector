import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import { roundToTwo } from "/utils/roundToTwo";
import Image from "/components/Image";

export default function Collected({ activity }) {
  const [results, setResults] = useState();

  useEffect(() => {
    if (!activity) return;
    let res = activity.filter((a) => a.type === "won" || a.type === "sale");
    setResults(res);
  }, [activity]);

  return (
    <div className="mt-16">
      <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
        Collected
      </h2>
      {results && (
        <div className="flex flex-wrap gap-8">
          {results.map((item, index) => (
            <div key={index} className="sm:max-w-sm mb-5">
              <p className="text-xs inline text-gray-400 dark:text-whitish clear-both">
                <Moment date={item.time} unix fromNow /> on{" "}
                {item.attributes.source}
              </p>
              {item.type === "won" && (
                <p className="text-sm dark:text-whitish overflow-hidden mb-3">
                  Won{" "}
                  <Link href={`/nft/${item.attributes.mint}`}>
                    <a className="hover:underline">{item.attributes.name}</a>
                  </Link>{" "}
                  by {item.attributes.brand_name} for ◎
                  {roundToTwo(item.attributes.highest_bid / 1000000000)}
                </p>
              )}

              {item.type === "sale" && (
                <p className="text-sm dark:text-whitish overflow-hidden mb-3">
                  Purchased{" "}
                  <Link href={`/nft/${item.attributes.mint}`}>
                    <a className="hover:underline">{item.attributes.name}</a>
                  </Link>{" "}
                  {item.attributes.artist_name && (
                    <>by {item.attributes.artist_name} </>
                  )}
                  for ◎{roundToTwo(item.attributes.amount / 1000000000)}
                </p>
              )}

              <div className="clear-both"></div>

              <Link href={`/nft/${item.attributes.mint}`}>
                <a>
                  <Image token={item.attributes} size="large" />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
