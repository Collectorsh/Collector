import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Galleries from "/components/home/Galleries";
import UserContext from "/contexts/user";

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <Hero />
        <Galleries />
      </div>
    </div>
  );
}
