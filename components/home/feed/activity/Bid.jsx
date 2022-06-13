import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";

export default function Bid({ item }) {
  return (
    <div className="mb-12">
      {item.twitter_profile_image && (
        <img
          src={item.twitter_profile_image}
          className="w-12 h-12 mr-2 rounded-full float-left mb-4"
        />
      )}
      <p className="text-md dark:text-whitish overflow-hidden">
        <CollectorUsername username={item.username} /> placed a bid for ◎
        {roundToTwo(item.amount / 1000000000)} on{" "}
        <Link
          href={marketplaceLink(
            item.attributes.source,
            item.attributes.mint,
            item.attributes.brand_name,
            item.attributes.highest_bidder_username
          )}
        >
          <a className="font-bold">{item.attributes.name}</a>
        </Link>{" "}
        by {item.attributes.brand_name}
      </p>
      <p className="text-xs mt-3 mb-1 text-gray-400 dark:text-whitish clear-both">
        <Moment date={item.time} unix fromNow /> on {item.attributes.source}
        <span className="float-right">New Bid</span>
      </p>
      <Link
        href={marketplaceLink(
          item.attributes.source,
          item.attributes.mint,
          item.attributes.brand_name,
          item.attributes.highest_bidder_username
        )}
      >
        <a>
          <Image token={item.attributes} size="large" />
        </a>
      </Link>
    </div>
  );
}
