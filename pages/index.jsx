import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Galleries from "/components/home/Galleries";
import DropSecondary from "/components/home/DropSecondary";
import Tools from "/components/home/Tools";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <Hero />
      </div>
      <div className="border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <DropSecondary />
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 border-t border-neutral-100 dark:border-neutral-800">
        <Galleries />
      </div>
      <div className="border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <Tools />
        </div>
      </div>
    </div>
  );
}
