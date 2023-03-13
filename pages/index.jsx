import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
// import Hero from "/components/home/Hero";
import UpcomingDrop from "/components/home/UpcomingDrop";
import Galleries from "/components/home/Galleries";
import DropSecondary from "/components/home/DropSecondary";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="w-full">
        <UpcomingDrop />
        <div className="bg-gray-50 dark:bg-dark1">
          <DropSecondary />
        </div>
        <div className="">
          <Galleries />
        </div>
      </div>
    </div>
  );
}
