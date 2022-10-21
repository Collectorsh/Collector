import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";
import FollowButton from "/components/FollowButton";

export default function Details({ item }) {
  return (
    <div className="relative border border-gray-100 dark:border-dark2 rounded p-4 shadow-lg">
      <div className="absolute top-2 right-2">
        {item.artist_name && <FollowButton follow={item} />}
      </div>
      <div className="float-left w-12/12">
        <p className="text-xs text-gray-400 dark:text-dark4 clear-both mb-4">
          <Moment date={item.time} unix fromNow /> on {item.attributes.source}
        </p>

        {item.twitter_profile_image && (
          <img
            src={item.twitter_profile_image}
            className="w-12 h-12 mr-2 rounded-full float-left mb-4"
          />
        )}

        {!item.twitter_profile_image && (
          <div className="w-12 h-12 mr-2 rounded-full float-left mb-4 bg-gray-100" />
        )}

        <div className="mb-0">
          {item.username && (
            <p className="mr-2 mt-6">
              <CollectorUsername username={item.username} />
            </p>
          )}
        </div>

        <div className="mt-8"></div>

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
            by {item.attributes.brand_name} for ◎
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
            {item.artist_name && <>by {item.artist_name} </>}
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
            {item.artist_name && <> by {item.artist_name}</>}
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
            by {item.artist_name}
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
    </div>
  );
}
