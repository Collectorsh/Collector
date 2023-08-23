import React, { useContext, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Galleries from "/components/home/Galleries";
import UserContext from "/contexts/user";
import HighlightedCurations from "../components/home/HighlightedCurations";

export default function Home() {
  const [user] = useContext(UserContext);
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <Hero />
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 border-t border-neutral-100 dark:border-neutral-800 py-10">
        <HighlightedCurations />
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 border-t border-neutral-100 dark:border-neutral-800 py-10">
        <Galleries />
      </div>
    </div>
  );
}
