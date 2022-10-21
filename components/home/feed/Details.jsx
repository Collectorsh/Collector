import React, { useContext } from "react";
import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";
import FollowButton from "/components/FollowButton";
import UserContext from "/contexts/user";

export default function Details({ item }) {
  const [user, setUser] = useContext(UserContext);

  return (
    <div className="relative border border-gray-100 dark:border-dark2 rounded p-4 shadow-lg">
      <div className="float-left w-12/12">
        {item.twitter_profile_image && (
          <img
            src={item.twitter_profile_image}
            className="w-12 h-12 mr-2 -mt-1 rounded-full float-left"
          />
        )}

        <div className="mb-0">
          {item.username && item.twitter_profile_image && (
            <p className="mr-2 mt-2 mb-5">
              <CollectorUsername username={item.username} />
            </p>
          )}
          {item.username && !item.twitter_profile_image && (
            <p className="mr-2 mt-1">
              <CollectorUsername username={item.username} />
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-dark4 mb-2">
          <Moment date={item.time} unix fromNow /> on {item.attributes.source}
        </p>

        {item.type === "won" && (
          <p className="text-sm dark:text-whitish mb-3">
            Won{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.brand_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            by <strong>{item.attributes.brand_name}</strong> for ◎
            {roundToTwo(item.attributes.highest_bid / 1000000000)}
          </p>
        )}

        {item.type === "sale" && (
          <p className="text-sm dark:text-whitish mb-3">
            Purchased{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.artist_name}</a>
            </Link>{" "}
            {item.artist_name && (
              <>
                by <strong>{item.artist_name}</strong>{" "}
              </>
            )}
            for ◎{roundToTwo(item.attributes.amount / 1000000000)}
          </p>
        )}

        {item.type === "listing" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Listed{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>
            {item.artist_name && (
              <>
                {" "}
                by <strong>{item.artist_name}</strong>
              </>
            )}
            {item.attributes.amount && (
              <> for ◎{roundToTwo(item.attributes.amount / 1000000000)}</>
            )}
          </p>
        )}

        {item.type === "bid" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Placed a bid for ◎{roundToTwo(item.amount / 1000000000)} on{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            by <strong>{item.artist_name}</strong>
          </p>
        )}
      </div>

      <div className="clear-both border-b border-gray-100 dark:border-dark2 mb-4 -mx-4"></div>

      <Link
        href={marketplaceLink(
          item.attributes.source,
          item.attributes.mint,
          item.artist_name,
          item.attributes.highest_bidder_username
        )}
      >
        <a>
          <Image token={item.attributes} size="medium" />
        </a>
      </Link>

      {user && (
        <div className="text-right border-t border-gray-100 dark:border-dark2 pt-4 pr-3 mt-4 -mx-4">
          <p className="text-xs text-gray-400 dark:text-dark4 clear-both mb-4 inline">
            follow this artist{" "}
          </p>
          {item.artist_name && <FollowButton follow={item} />}
        </div>
      )}
    </div>
  );
}
