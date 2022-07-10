import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";
import FollowButton from "/components/FollowButton";
import ShareToTwitter from "/components/ShareToTwitter";

export default function Details({ item }) {
  const formatTweet = (item) => {
    let username = item.attributes.twitter_screen_name
      ? `@${item.attributes.twitter_screen_name}`
      : item.username;
    let artistName = item.attributes.twitter
      ? item.attributes.twitter
      : item.attributes.artist_name || item.attributes.brand_name;
    let name = item.attributes.name;

    let tweet;

    if (item.type === "won") {
      let amount = `◎${roundToTwo(item.attributes.highest_bid / 1000000000)}`;

      tweet = `${name} by ${artistName} was won by ${username} for ${amount}`;
    } else if (item.type === "listing") {
      let amount = `◎${roundToTwo(item.attributes.amount / 1000000000)}`;

      tweet = `${name} by ${artistName} was listed by ${username}`;
      if (amount) {
        tweet += ` for ◎${roundToTwo(item.attributes.amount / 1000000000)}`;
      }
    } else if (item.type === "bid") {
      let amount = `◎${roundToTwo(item.amount / 1000000000)}`;

      tweet = `A bid for ${amount} was placed by ${username} on ${name} by ${artistName}`;
    } else if (item.type === "sale") {
      let amount = `◎${roundToTwo(item.attributes.amount / 1000000000)}`;

      tweet = `${name} by ${artistName} was purchase by ${username} for ${amount}`;
    }

    tweet += "%0a%0a";

    tweet += "Seen on the @collector_sh feed";

    tweet += "%0a%0a";

    tweet += `${marketplaceLink(
      item.attributes.source,
      item.attributes.mint,
      item.attributes.brand_name,
      item.attributes.highest_bidder_username
    )}`;

    return tweet;
  };

  return (
    <div className="mb-12">
      <div className="float-left w-11/12">
        {item.twitter_profile_image && (
          <img
            src={item.twitter_profile_image}
            className="w-12 h-12 mr-2 rounded-full float-left mb-4"
          />
        )}

        <div className="mb-0">
          {item.username && (
            <p className="inline mr-2">
              <CollectorUsername username={item.username} />
            </p>
          )}

          <p className="text-xs inline text-gray-400 dark:text-whitish clear-both">
            <Moment date={item.time} unix fromNow /> on {item.attributes.source}
          </p>
        </div>

        {item.type === "won" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
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
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Purchased{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            {item.attributes.artist_name && (
              <>by {item.attributes.artist_name} </>
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
                item.attributes.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>
            {item.attributes.artist_name && (
              <> by {item.attributes.artist_name}</>
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
                item.attributes.brand_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            by {item.attributes.brand_name}
          </p>
        )}
      </div>

      <div className="float-right mt-2">
        <FollowButton follow={item} />
      </div>

      <div className="clear-both"></div>

      <Link
        href={marketplaceLink(
          item.attributes.source,
          item.attributes.mint,
          item.attributes.brand_name,
          item.attributes.highest_bidder_username
        )}
      >
        <a>
          <Image token={item.attributes} size="medium" />
        </a>
      </Link>

      <span className="-ml-2">
        <ShareToTwitter
          url={formatTweet(item)}
          size="18"
          text="Share to Twitter"
        />
      </span>
    </div>
  );
}
