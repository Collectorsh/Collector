import React, { useState } from "react";
import {
  StarIcon,
  ClipboardListIcon,
  CalendarIcon,
  CollectionIcon,
  SparklesIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import AllListings from "/components/home/feed/AllListings";
import Galleries from "/components/home/feed/Galleries";
import BuyNow from "/components/home/feed/BuyNow";
import RightColumn from "/components/home/RightColumn";
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
      <div className="flex">
        <div className="h-fit h-[calc(100vh-80px)] sticky top-[80px] w-16 lg:w-64 px-2">
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

                <span className="hidden lg:flex mx-4 font-medium">
                  Activity
                </span>
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

                <span className="hidden lg:flex mx-4 font-medium">
                  Following
                </span>
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

                <span className="hidden lg:flex mx-4 font-medium">
                  Auctions
                </span>
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

                <span className="hidden lg:flex mx-4 font-medium">
                  Listings
                </span>
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

                <span className="hidden lg:flex mx-4 font-medium">
                  Galleries
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div
          id="feed"
          className="lg:flex-1 lg:flex lg:border-l border-whitish dark:border-dark3"
        >
          <div className="lg:flex-1">
            <div className="mx-4 lg:mx-8">
              {feedSelected === "activity" && <Activity />}
              {feedSelected === "following" && <Following />}
              {feedSelected === "auctions" && <Auctions />}
              {feedSelected === "buynow" && <BuyNow />}
              {feedSelected === "listings" && <AllListings />}
              {feedSelected === "galleries" && <Galleries />}
            </div>
          </div>
        </div>

        {feedSelected !== "auctions" && (
          <div className="hidden lg:block lg:w-80 xl:w-96 px-2">
            <RightColumn />
          </div>
        )}

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
