import React, { useContext, useState } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Featured from "/components/home/Featured";
import Feed from "/components/home/Feed";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);
  const [feed, setFeed] = useState("activity");

  const updateFeed = (feed) => {
    setFeed(feed);
  };

  return (
    <div className="dark:bg-black">
      <MainNavigation />
      {!user && <Hero />}
      <Featured updateFeed={updateFeed} />
      <Feed feed={feed} />
    </div>
  );
}
