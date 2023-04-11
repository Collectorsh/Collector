import React, { useContext } from "react";
import ListingsContext from "/contexts/listings";
import Image from "/components/Image";
import { roundToTwo } from "/utils/roundToTwo";

export default function Listings() {
  const [listings] = useContext(ListingsContext);

  return (
    <div className="clear-both mt-6 max-w-screen-2xl mx-auto px-4 sm:px-8">
      <div className="pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
        {listings.map((listing, index) => (
          <div
            key={index}
            className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
          >
            <div className="rounded-lg overflow-hidden">
              <Image
                token={{
                  image: listing.image,
                  animation_url: listing.animation_url,
                  mint: listing.mint,
                }}
              />
            </div>
            <div>
              <div className="w-full">
                <div className="h-fit my-1">
                  <h3 className="text-md text-black dark:text-whitish font-medium">
                    {listing.name}
                  </h3>
                  <div className="float-left my-2">
                    <span className="font-bold text-sm">
                      ◎{roundToTwo(listing.price / 1000000000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
