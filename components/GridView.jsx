import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import CollectorUsername from "/components/CollectorUsername";
import Moment from "react-moment";
import Image from "/components/Image";

export default function GridView({ items, type }) {
  return (
    <div id="grid-container">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid-item bg-white dark:bg-dark3 shadow-2xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
        >
          <div className="grid-image-container rounded-lg">
            {type === "listing" && (
              <Link href={`/nft/${item.mintAddress}`}>
                <a>
                  <Image token={item} />
                </a>
              </Link>
            )}
            {type === "auction" && (
              <Link
                href={marketplaceLink(
                  item.source,
                  item.mint,
                  item.brand_name,
                  item.highest_bidder_username
                )}
              >
                <a>
                  <Image token={item} />
                </a>
              </Link>
            )}
          </div>
          <div>
            <div className="w-full">
              <h3 className="text-md text-black dark:text-whitish font-medium my-2">
                {item.name}
              </h3>
              {item.brand_name && (
                <p className="dark:text-whitish text-xs -mt-2 mb-2">
                  {item.brand_name}
                </p>
              )}
              <div className="bg-black rounded-b-2xl px-[10px] py-5 text-gray-50 -mx-[10px]">
                <div className="text-sm">
                  {type === "listing" && (
                    <span className="font-black dark:text-whitish">
                      ◎{roundToTwo(item.listings[0].price / 1000000000)}
                    </span>
                  )}
                  {type === "auction" && (
                    <span className="font-black dark:text-whitish">
                      ◎
                      {roundToTwo(
                        (item.highest_bid || item.reserve) / 1000000000
                      )}
                    </span>
                  )}
                  {type === "auction" && (
                    <div className="float-right">
                      <MarketplaceLogo source={item.source} color="white" />
                      <div className="mt-1 text-right dark:text-whitish">
                        {item.number_bids}{" "}
                        {item.number_bids === 1 ? "bid" : "bids"}
                      </div>
                    </div>
                  )}
                  {type === "listing" && item.listings[0].username && (
                    <div className="float-right dark:text-whitish">
                      listed by{" "}
                      <CollectorUsername username={item.listings[0].username} />
                    </div>
                  )}
                </div>
                {type === "auction" && (
                  <p className="text-xs mt-2 dark:text-whitish">
                    Ends <Moment date={item.end_time} unix fromNow />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
