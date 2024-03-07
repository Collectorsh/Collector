import React, { useContext, useEffect, useState } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import LandingHero from "../components/landing/hero";
import LandingHighlightedCurations from "../components/landing/highlightedCurations";
import LandingRecentCurations from "../components/landing/recentCurations";
import LandingLetter from "../components/landing/letter";
import { getHighlightedCurations, getLatestCurations } from "../data/curation/getHighlightedCurations";


export const homepageWidthClass = "max-w-screen-2xl mx-auto 2xl:px-8"
export default function Home(
  // { highlightedCurations, recentCurations }
) {
  
  const [highlightedCurations, setHighlightedCurations] = useState([])
  const [recentCurations, setRecentCurations] = useState([])

  useEffect(() => {
    const fetchCurations = async () => {
      const featured = await getHighlightedCurations()
      const latest = await getLatestCurations()
      if (featured) setHighlightedCurations(featured.slice(0, 4))
      if(latest) setRecentCurations(latest.slice(0, 6))
    }
    fetchCurations()
  }, [])
  
  return (
    <div className="">
      <MainNavigation />
      
      <LandingHero />
      <LandingHighlightedCurations curations={highlightedCurations} />
      <LandingRecentCurations curations={recentCurations} />
      <LandingLetter />   
    </div>
  );
}

// export async function getServerSideProps() {
//   try {
//     const featured = await getHighlightedCurations()
//     const latest = await getLatestCurations()
//     if (featured && latest) {
//       return {
//         props: {
//           highlightedCurations: featured.slice(0, 4),
//           recentCurations: latest.slice(0, 6)
//         }
//       };
//     } else {
//       return { props: {} };
//     }
//   } catch (err) {
//     console.log(err);
//     return { props: {} };
//   }
// }
