import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { scrollToFeed } from "/utils/scrollToFeed";

export default function Featured({ updateFeed }) {
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
      <div className="bg-black dark:bg-black dark:border-t dark:border-b dark:border-dark3 mb-12 w-full sticky top-[74px] z-10 mb-18">
        <h1 className="text-white text-center py-3 md:py-6 tracking-wide w-full">
          <div className="md:inline">
            <span
              className="cursor-pointer mx-3 text-lg"
              onClick={() => changeFeed("activity")}
            >
              Activity
            </span>
            <span>&middot;</span>
            <span
              className="cursor-pointer mx-3 text-lg"
              onClick={() => changeFeed("following")}
            >
              Following
            </span>
            <span>&middot;</span>
            <span
              className="cursor-pointer mx-3 text-lg"
              onClick={() => changeFeed("auctions")}
            >
              Auctions
            </span>
            <span className="hidden md:inline">&middot;</span>
          </div>
          <div className="md:inline">
            <span
              className="cursor-pointer mx-3 text-lg"
              onClick={() => changeFeed("listings")}
            >
              Listings
            </span>
            <span>&middot;</span>
            <span
              className="cursor-pointer mx-3 text-lg"
              onClick={() => changeFeed("galleries")}
            >
              Galleries
            </span>
          </div>
        </h1>
      </div>
    </>
  );
}
