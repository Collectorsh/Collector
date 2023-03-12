import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import ShowOffers from "/components/gallery/ShowOffers";

export default function BuynowListings({ listings, user }) {
  console.log(listings);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center sm:justify-start">
      {listings.map((item, index) => (
        <div
          key={index}
          className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
        >
          <div className="rounded-lg overflow-hidden">
            <Link
              href={marketplaceLink(item.source, item.mint, item.artist_name)}
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
                <div className="clear-both mt-0.5">
                  {item.twitter_profile_image && (
                    <img
                      src={item.twitter_profile_image}
                      className="w-4 h-4 mr-1 rounded-full float-left"
                    />
                  )}
                  {item.artist && (
                    <p className="dark:text-whitish text-xs mb-2">
                      @{item.artist}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-black rounded-b-2xl px-[10px] py-3 text-gray-50 -mx-[10px] h-16">
                <div className="text-sm">
                  <div className="font-black dark:text-whitish float-left">
                    ◎{roundToTwo(item.amount / 1000000000)}
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
                  </div>
                  <div className="float-right">
                    <MarketplaceLogo source={item.source} color="white" />
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
