import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import CollectorUsername from "/components/CollectorUsername";
import Moment from "react-moment";
import Image from "/components/Image";

export default function GridView({ items, type }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
        >
          <div className="rounded-lg overflow-hidden">
            {(type === "listing" || type === "collector_listing") && (
              <Link href={`/nft/${item.mintAddress}`}>
                <a>
                  <Image token={item} />
                </a>
              </Link>
            )}
            {type === "collected" && (
              <Link href={`/nft/${item.attributes.mint}`}>
                <a>
                  <Image
                    token={{
                      image: item.attributes.image,
                      mint: item.attributes.mint,
                    }}
                  />
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
              <div className="h-12">
                <h3 className="text-md text-black dark:text-whitish font-medium my-2">
                  {item.name || item.attributes.name}
                </h3>
                {item.brand_name && (
                  <p className="dark:text-whitish text-xs -mt-2 mb-2">
                    {item.brand_name}
                  </p>
                )}
                {type === "collected" && item.type === "sale" && (
                  <p className="dark:text-whitish text-xs -mt-2 mb-2">
                    {item.attributes.artist_name}
                  </p>
                )}
                {type === "collected" && item.type == "won" && (
                  <p className="dark:text-whitish text-xs -mt-2 mb-2">
                    {item.attributes.brand_name}
                  </p>
                )}
              </div>

              <div className="bg-black rounded-b-2xl px-[10px] py-3 text-gray-50 -mx-[10px] h-16">
                <div className="text-sm">
                  {(type === "listing" || type === "collector_listing") && (
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
                  {type === "collected" && item.type == "won" && (
                    <span className="font-black dark:text-whitish">
                      ◎{roundToTwo(item.attributes.highest_bid / 1000000000)}
                    </span>
                  )}
                  {type === "collected" && item.type === "sale" && (
                    <span className="font-black dark:text-whitish">
                      ◎{roundToTwo(item.attributes.amount / 1000000000)}
                    </span>
                  )}
                  {type === "collected" && item.type === "won" && (
                    <div className="float-right">
                      <MarketplaceLogo
                        source={item.attributes.source}
                        color="white"
                      />
                      <div className="mt-1 text-right dark:text-whitish">
                        {item.attributes.number_of_bids}{" "}
                        {item.attributes.number_of_bids === 1 ? "bid" : "bids"}
                      </div>
                    </div>
                  )}
                  {type === "collected" && item.type === "sale" && (
                    <div className="float-right">
                      <MarketplaceLogo
                        source={item.attributes.source}
                        color="white"
                      />
                    </div>
                  )}
                  {type === "collector_listing" && (
                    <div className="float-right">
                      <MarketplaceLogo source={"collector"} color="white" />
                    </div>
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
