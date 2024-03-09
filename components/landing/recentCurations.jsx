import React from "react";
import LandingCurationItem, { LandingCurationItemPlaceholder }  from "./curationItem";
import SvgCurve from "../svgCurve";
import { homepageWidthClass } from "../../pages";


export default function LandingRecentCurations({curations}) {
  return (
    <div className="pt-12 pb-40 2xl:pb-44 relative"> 
      <SvgCurve
        turned
      />
      <div className={homepageWidthClass}>
     
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 2xl:px-0">
          <h2 className="font-bold text-4xl md:text-5xl text-center collector mb-14">Latest</h2>
          {/* <p className="textPalette2 text-center mb-8">Hot off the presses</p> */}

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