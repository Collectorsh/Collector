import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Feed from "/components/home/Feed";
import UserContext from "/contexts/user";

export default function FeedHome() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <Feed />
      </div>
    </div>
  );
}
