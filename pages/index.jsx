import React, { useContext, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";

import getHighlightedCurations from "../data/curation/getHighlightedCurations";
import LandingHero from "../components/landing/hero";
import LandingHighlightedCurations from "../components/landing/highlightedCurations";
import LandingRecentCurations from "../components/landing/recentCurations";
import LandingLetter from "../components/landing/letter";

export default function Home({highlightedCurations, recentCurations}) {
  return (
    <div className="">
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
        <LandingHero />
        <LandingHighlightedCurations curations={highlightedCurations} />
        <LandingRecentCurations curations={recentCurations} />
        <LandingLetter />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getHighlightedCurations()
    if (res) {
      return {
        props: {
          highlightedCurations: res.slice(0, 4),
          recentCurations: res.slice(0, 6)
        }
      };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}
