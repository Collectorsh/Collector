import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { scrollToFeed } from "/utils/scrollToFeed";
import {
  StarIcon,
  ClipboardListIcon,
  CalendarIcon,
  CollectionIcon,
  SparklesIcon,
} from "@heroicons/react/outline";

export default function FeedMenu({ updateFeed }) {
  const router = useRouter();
  const [feed, setFeed] = useState("activity");

  const changeFeed = (feed) => {
    router.push(`/?feed=${feed}`, undefined, { shallow: true });
    setFeed(feed);
  };

  useEffect(() => {
    if (!router.query.feed) return;
    updateFeed(router.query.feed);
    scrollToFeed();
  }, [router.query.feed]);

  return (
    <>
      <ul className="text-sm">
        <li className="mb-4 md:mb-2">
          <a
            className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-black dark:text-whitish rounded-md ${
              feed === "activity"
                ? "bg-gray-100 dark:bg-dark3 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer hover:font-bold"
            }`}
            onClick={() => changeFeed("activity")}
          >
            <SparklesIcon className="w-5 h-5" aria-hidden="true" />

            <span className="hidden md:flex mx-4">
              Activity
            </span>
          </a>
        </li>
        <li className="mb-4 md:mb-2">
          <a
            className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-black dark:text-whitish rounded-md ${
              feed === "following"
                ? "bg-gray-100 dark:bg-dark3 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer hover:font-bold"
            }`}
            onClick={() => changeFeed("following")}
          >
            <StarIcon className="w-5 h-5" aria-hidden="true" />

            <span className="hidden md:flex mx-4">
              Following
            </span>
          </a>
        </li>
        <li className="mb-4 md:mb-2">
          <a
            className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-black dark:text-whitish rounded-md ${
              feed === "auctions"
                ? "bg-gray-100 dark:bg-dark3 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer hover:font-bold"
            }`}
            onClick={() => changeFeed("auctions")}
          >
            <CalendarIcon className="w-5 h-5" aria-hidden="true" />

            <span className="hidden md:flex mx-4">
              Auctions
            </span>
          </a>
        </li>
        <li className="mb-4 md:mb-2">
          <a
            className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-black dark:text-whitish rounded-md ${
              feed === "listings"
                ? "bg-gray-100 dark:bg-dark3 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer hover:font-bold"
            }`}
            onClick={() => changeFeed("listings")}
          >
            <ClipboardListIcon className="w-5 h-5" aria-hidden="true" />

            <span className="hidden md:flex mx-4">
              Listings
            </span>
          </a>
        </li>
        <li className="mb-4 md:mb-2">
          <a
            className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-black dark:text-whitish rounded-md ${
              feed === "galleries"
                ? "bg-gray-100 dark:bg-dark3 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-dark3 cursor-pointer hover:font-bold"
            }`}
            onClick={() => changeFeed("galleries")}
          >
            <CollectionIcon className="w-5 h-5" aria-hidden="true" />

            <span className="hidden md:flex mx-4">
              Galleries
            </span>
          </a>
        </li>
      </ul>
    </>
  );
}
