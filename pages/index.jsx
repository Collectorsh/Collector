import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Featured from "/components/home/Featured";
import Feed from "/components/home/Feed";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <Hero />
        <Feed />
      </div>
    </div>
  );
}
