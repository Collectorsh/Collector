import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";

export default function Sale({ item }) {
  return (
    <div className="mb-12">
      {item.twitter_profile_image && (
        <img
          src={item.twitter_profile_image}
          className="w-12 h-12 mr-2 rounded-full float-left mb-4"
        />
      )}
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
        </Link>{" "}
        {item.attributes.brand_name && `by ${item.attributes.brand_name} `}
        was purchase by <CollectorUsername username={item.username} /> for ◎
        {roundToTwo(item.attributes.amount / 1000000000)}
      </p>
      <p className="text-xs mt-3 mb-1 text-gray-400 dark:text-whitish clear-both">
        <Moment date={item.time} unix fromNow /> on{" "}
        {item.attributes.marketplace}
        <span className="float-right">Sale</span>
      </p>
      <Link
        href={marketplaceLink(
          item.attributes.marketplace,
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
