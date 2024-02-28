import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import ShowOffers from "/components/gallery/ShowOffers";
import Moment from "react-moment";

function FollowingAuctions({ auctions, user }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center sm:justify-start">
      {auctions.map((item, index) => (
        <div
          key={index}
          className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-neutral-200 dark:border-dark3"
        >
          <div className="rounded-lg overflow-hidden">
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
          </div>
          <div>
            <div className="w-full">
              <div className="h-14 my-1">
                <h3 className="text-md text-black dark:text-whitish font-medium">
                  {item.name || (item.attributes && item.attributes.name)}
                </h3>
                {item.brand_name && (
                  <p className="dark:text-whitish text-xs">{item.brand_name}</p>
                )}
                <div className="clear-both mt-0.5">
                  {item.twitter_profile_image && (
                    <img
                      src={item.twitter_profile_image}
                      className="w-4 h-4 mr-1 rounded-full float-left"
                    />
                  )}
                  {item.artist_name && (
                    <p className="dark:text-whitish text-xs mb-2">
                      @{item.artist_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-black rounded-b-2xl px-[10px] py-3 text-neutral-50 -mx-[10px] h-16">
                <div className="text-sm">
                  <div className="font-black dark:text-whitish float-left">
                    <span className="font-black dark:text-whitish">
                      ◎
                      {roundToTwo(
                        (item.highest_bid || item.reserve) / 1000000000
                      )}
                    </span>
                    <div className="mt-1">
                      {item.username_twitter && (
                        <img
                          src={item.username_twitter}
                          className="w-4 h-4 mr-1 rounded-full float-left"
                        />
                      )}
                      {item.username && (
                        <p className="dark:text-whitish text-xs mb-2 font-normal float-right">
                          {item.username}
                        </p>
                      )}
                    </div>
                    <p className="text-xs mt-2 dark:text-whitish">
                      Ends <Moment date={item.end_time} unix fromNow />
                    </p>
                  </div>
                  <div className="float-right">
                    <MarketplaceLogo source={item.source} color="white" />
                    <div className="mt-1 text-right dark:text-whitish">
                      {item.number_bids}{" "}
                      {item.number_bids === 1 ? "bid" : "bids"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShowOffers token={item} />
        </div>
      ))}
    </div>
  );
}

export default FollowingAuctions;
