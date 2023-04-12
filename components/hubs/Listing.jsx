import React, { useState } from "react";
import Image from "/components/Image";
import BuyModal from "/components/hubs/BuyModal";
import { roundToTwo } from "/utils/roundToTwo";

export default function Listing({ listing }) {
  const [buyModal, setBuyModal] = useState(false);

  function handleCloseModal() {
    setBuyModal(false);
  }

  return (
    <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3">
      <div
        onClick={(e) => setBuyModal(!buyModal)}
        className="rounded-lg overflow-hidden"
      >
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
      <BuyModal open={buyModal} token={listing} closeModal={handleCloseModal} />
    </div>
  );
}
