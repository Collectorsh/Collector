import React, { useState } from "react";
import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import AllListings from "/components/home/feed/AllListings";
import Galleries from "/components/home/feed/Galleries";
import RightColumn from "/components/home/RightColumn";
import FeedMenu from "/components/home/FeedMenu";
import { capitalize } from "/utils/capitalize";

export default function Feed() {
  const [feed, setFeed] = useState("activity");

  const updateFeed = (feed) => {
    setFeed(feed);
  };

  return (
    <div id="feed" className="pl-2 px-4 xl:px-0 pt-2 md:pt-4 mt-16">
      <h2 className="w-full pb-2 text-4xl font-extrabold mb-8 text-black w-fit inline-block dark:text-whitish border-b border-whitish dark:border-dark3 sticky top-0 z-40 pt-3 bg-white dark:bg-black">
        {capitalize(feed)}
        <FeedMenu updateFeed={updateFeed} />
      </h2>
      <div className={`${feed === "auctions" ? "block" : "flex"}`}>
        <div
          className={`min-h-screen flex-1 ${feed !== "auctions" && "md:mr-12"}`}
        >
          {(feed === "activity" || !feed) && <Activity />}
          {feed === "following" && <Following />}
          {feed === "auctions" && <Auctions />}
          {feed === "listings" && <AllListings />}
          {feed === "galleries" && <Galleries />}
        </div>
        {feed === "activity" && (
          <div className="hidden md:block md:w-[300px] xl:w-96 px-2 pt-4">
            <RightColumn />
          </div>
        )}
      </div>
    </div>
  );
}
