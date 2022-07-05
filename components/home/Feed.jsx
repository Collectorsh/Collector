import React, { useState } from "react";
import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import AllListings from "/components/home/feed/AllListings";
import Galleries from "/components/home/feed/Galleries";
import RightColumn from "/components/home/RightColumn";
import FeedMenu from "/components/home/FeedMenu"

export default function Feed() {
  const [feed, setFeed] = useState("activity");

  const updateFeed = (feed) => {
    setFeed(feed);
  };

  return (
    <>
      <div
        className="flex mr-4 md:ml-6 md:mr-6" id="feed"
      >
        <div className="h-fit h-[calc(100vh-80px)] sticky top-[74px] w-16 md:w-56 xl:w-64 px-2 pt-2 md:pt-4">
          <FeedMenu updateFeed={updateFeed} />
        </div>
        <div className="md:flex-1 pl-2 md:pl-12 lg:pr-12 pt-2 md:pt-4">
          {(feed === "activity" || !feed) && <Activity />}
          {feed === "following" && <Following />}
          {feed === "auctions" && <Auctions />}
          {feed === "listings" && <AllListings />}
          {feed === "galleries" && <Galleries />}
        </div>
        {feed !== "auctions" && (
          <div className="hidden lg:block lg:w-80 xl:w-96 px-2 pt-4">
            <RightColumn />
          </div>
        )}
      </div>
    </>
  );
}
