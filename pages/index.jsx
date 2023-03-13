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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <UpcomingDrop />
      </div>
      <div className="bg-gray-50 dark:bg-dark1">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <DropSecondary />
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <Galleries />
      </div>
    </div>
  );
}
