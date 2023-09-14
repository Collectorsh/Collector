import React, { useContext, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Galleries from "/components/home/Galleries";
import UserContext from "/contexts/user";
import HighlightedCurations from "../components/home/HighlightedCurations";
import getHighlightedCurations from "../data/curation/getHighlightedCurations";

export default function Home({highlightedCurations}) {
  const [user] = useContext(UserContext);
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <Hero />
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8  border-neutral-100 dark:border-neutral-800 py-10">
        {highlightedCurations !== undefined 
          ? <HighlightedCurations curations={highlightedCurations} />
          : <div className="flex flex-col gap-5 justify-center items-center mt-28">
            <p className="text-8xl">🚧</p>
            <p className="text-xl">Coming Soon!</p>
          </div>
        }
      </div>
      {/* <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 border-t border-neutral-100 dark:border-neutral-800 py-10">
        <Galleries />
      </div> */}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getHighlightedCurations()
    if (res) {
      return { props: { highlightedCurations: res } };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}
