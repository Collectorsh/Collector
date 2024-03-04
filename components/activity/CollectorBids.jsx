import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import Image from "/components/Image";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Moment from "react-moment";

function CollectorBids({ bids }) {
  return (
    <div className="mb-12">
      <div id="grid-container">
        {bids.map((auction, index) => (
          <div
            key={index}
            className="grid-item bg-white dark:bg-dark3 rounded-2xl pt-[10px] px-[10px] border border-neutral-200 dark:border-dark3"
          >
            <div className="grid-image-container rounded-lg">
              <Link
                href={marketplaceLink(
                  auction.source,
                  auction.mint,
                  auction.brand_name,
                  auction.highest_bidder_username
                )}
              >
                <a>
                  <Image token={auction} />
                </a>
              </Link>
            </div>
            <div>
              <div className="w-full">
                <h3 className="text-lg text-black dark:text-white font-medium my-2">
                  {auction.brand_name}
                </h3>
                <div className="bg-black rounded-b-2xl px-[10px] py-5 text-neutral-50 -mx-[10px]">
                  <div className="text-sm">
                    <span className="font-black">
                      ◎{roundToTwo(auction.highest_bid / 1000000000)}
                    </span>
                    <span className="text-sm ml-1">
                      {auction.highest_bid === auction.bid ? "👍" : "👎"}
                    </span>
                    <div className="float-right">
                      <MarketplaceLogo source={auction.source} color="white" />
                      <div className="mt-1 text-right">
                        {auction.number_bids}{" "}
                        {auction.number_bids === 1 ? "bid" : "bids"}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-2">
                    Ends <Moment date={auction.end_time} unix fromNow />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectorBids;
