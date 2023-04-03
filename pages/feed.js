import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Feed from "/components/home/Feed";
import UserContext from "/contexts/user";

export default function FeedHome() {
  const [user] = useContext(UserContext);

  return (
    <div>
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="mt-8 text-5xl font-semibold text-neutral-800 w-full py-1 inline-block dark:text-white">
            Activity
          </h2>
          <p className="mb-16 dark:text-whitish">
            See what Collectors are bidding on, buying, and listing
          </p>
          <div className="w-full pb-3">
            <Feed />
          </div>
        </div>
      </div>
    </div>
  );
}
