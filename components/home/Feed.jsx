import React, { useState } from "react";
import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import Galleries from "/components/home/feed/Galleries";
import RightColumn from "/components/home/RightColumn";
import FeedMenu from "/components/home/FeedMenu";
import { capitalize } from "/utils/capitalize";
import { scrollToFeed } from "/utils/scrollToFeed";

export default function Feed() {
  const [feed, setFeed] = useState("activity");

  const updateFeed = (feed) => {
    setFeed(feed);
    scrollToFeed();
  };

  return (
    <div id="feed" className="pl-2 px-4 xl:px-0 pt-2 md:pt-4 mt-16">
      <h2 className="w-full pb-2 font-extrabold mb-8 text-black w-fit inline-block dark:text-whitish border-b border-whitish dark:border-dark3 sticky top-0 z-40 pt-3 bg-white dark:bg-black">
        <span className="text-3xl sm:text-4xl block sm:inline-block text-center sm:text-left">
          {capitalize(feed)}
        </span>
        <FeedMenu feed={feed} updateFeed={updateFeed} />
      </h2>
      <div
        className={`grid ${
          feed === "auctions" ? "grid-cols-1" : "grid-cols-12"
        }`}
      >
        <div className={`col-span-12 md:col-span-7 lg:col-span-5`}>
          {(feed === "activity" || !feed) && <Activity />}
          {feed === "following" && <Following />}
          {feed === "auctions" && <Auctions />}
          {feed === "galleries" && <Galleries />}
        </div>
        {(feed === "activity" || feed === "following") && (
          <div className="hidden md:block md:col-span-4 md:col-end-13">
            <RightColumn />
          </div>
        )}
      </div>
    </div>
  );
}
