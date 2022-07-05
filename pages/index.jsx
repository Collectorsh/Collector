import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Feed from "/components/home/Feed";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="mt-[74px]"></div>
      {!user && <Hero />}
      <Feed />
    </div>
  );
}
