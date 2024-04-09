import React from "react";
import LandingCurationItem, { LandingCurationItemPlaceholder }  from "./curationItem";
import SvgCurve from "../svgCurve";
import { homepageWidthClass } from "../../pages";
import * as Icon from "react-feather";
import Link from "next/link";

export default function LandingRecentCurations({curations}) {
  return (
    <div className="pt-12 pb-40 2xl:pb-44 relative"> 
      <SvgCurve
        turned
      />
      <div className={homepageWidthClass}>
     
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 2xl:px-0">
          <h2 className="font-bold text-4xl md:text-5xl text-center collector mb-2">Latest</h2>
          {/* <p className="textPalette2 text-center mb-8">Hot off the presses</p> */}
          <Link href="/discover" passHref className="textPalette2 text-center flex items-center justify-center gap-2 text-lg font-bold mb-12 hoverPalette1 rounded-md px-3 py-0.5 w-fit mx-auto duration-300">
            See All
            <Icon.ArrowRight size={22} strokeWidth={2.5} />
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
            {curations.length
              ? (
                curations.map(curation => (
                  <LandingCurationItem
                    key={curation.id}
                    curation={curation}
                  />
                ))
              )
              : Array.from({ length: 6 }).map((_, i) => <LandingCurationItemPlaceholder key={i} />)
            }
          </div> 
        </div>
          

      </div>
    </div>
  );
}