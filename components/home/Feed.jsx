import React, { useState } from "react";
import {
  StarIcon,
  ClipboardListIcon,
  CalendarIcon,
  CollectionIcon,
  SparklesIcon,
  ChevronUpIcon,
  LightningBoltIcon,
} from "@heroicons/react/outline";
import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import AllListings from "/components/home/feed/AllListings";
import Galleries from "/components/home/feed/Galleries";
import BuyNow from "/components/home/feed/BuyNow";
import ShowScrollToTop from "/components/home/ShowScrollToTop";
import { scrollToFeed } from "/utils/scrollToFeed";

export default function Feed() {
  const [feedSelected, setFeedSelected] = useState("activity");

  const updateFeedSelected = (feed) => {
    setFeedSelected(feed);
  };

  return (
    <>
      <ShowScrollToTop />
      <div className="sm:flex mb-0">
        <div className="h-fit sm:h-[calc(100vh-80px)] sm:sticky sm:top-[80px] w-full sm:w-52 md:w-64 px-2 lg:ml-9">
          <ul className="text-sm">
            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "activity"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => updateFeedSelected("activity")}
              >
                <SparklesIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">Activity</span>
              </a>
            </li>

            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "following"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => updateFeedSelected("following")}
              >
                <StarIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">Following</span>
              </a>
            </li>

            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "auctions"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => setFeedSelected("auctions")}
              >
                <CalendarIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">Live Auctions</span>
              </a>
            </li>

            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "listings"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => setFeedSelected("listings")}
              >
                <ClipboardListIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">All Listings</span>
              </a>
            </li>

            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "buynow"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => setFeedSelected("buynow")}
              >
                <LightningBoltIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">Buy Now</span>
              </a>
            </li>

            <li className="mb-2">
              <a
                className={`flex items-center px-4 py-2 text-black dark:text-whitish rounded-md ${
                  feedSelected === "galleries"
                    ? "bg-gray-100 dark:bg-dark3"
                    : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer"
                }`}
                onClick={() => setFeedSelected("galleries")}
              >
                <CollectionIcon className="h-5 w-5" aria-hidden="true" />

                <span className="mx-4 font-medium">Galleries</span>
              </a>
            </li>
          </ul>
        </div>

        <div
          id="feed"
          className="sm:flex-1 sm:flex sm:border-l border-black dark:border-gray-400"
        >
          <div className="sm:flex-1">
            <div className="mx-4 sm:mx-6 lg:mx-16">
              {feedSelected === "activity" && <Activity />}
              {feedSelected === "following" && <Following />}
              {feedSelected === "auctions" && <Auctions />}
              {feedSelected === "buynow" && <BuyNow />}
              {feedSelected === "listings" && <AllListings />}
              {feedSelected === "galleries" && <Galleries />}
            </div>
          </div>
        </div>

        <div
          id="scroll-to-top"
          className="fixed bottom-2 right-2 bg-whitish rounded-full cursor-pointer p-2"
          onClick={scrollToFeed}
        >
          <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
