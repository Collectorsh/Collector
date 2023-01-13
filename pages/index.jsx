import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
// import Hero from "/components/home/Hero";
import UpcomingDrop from "/components/home/UpcomingDrop";
import Galleries from "/components/home/Galleries";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        {/* <Hero /> */}
        <UpcomingDrop />
        <Galleries />
      </div>
    </div>
  );
}
