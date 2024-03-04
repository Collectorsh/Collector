import React from "react";
import LandingCurationItem  from "./curationItem";
import SvgCurve from "../svgCurve";
import { homepageWidthClass } from "../../pages";


export default function LandingHighlightedCurations({curations}) {
  //pt-28 pb-60
  return (
    <div className="pt-12 pb-40  relative bg-neutral-200 dark:bg-neutral-800 mt-56">
      <div id="featuredCurations" className="absolute top-[-130px] md:top-[-160px] lg:top-[-200px]"/>
      <SvgCurve
        color="fill-neutral-200 dark:fill-neutral-800"
      />
      <div className={homepageWidthClass}>
        {curations?.length
          ? (
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
              <h2 className="font-bold text-4xl md:text-5xl text-center collector mb-14">Featured</h2>
              {/* <p className="textPalette2 text-center mb-8">These curations really knock our socks off</p> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {curations.map(curation => (
                  <LandingCurationItem
                    key={curation.id}
                    curation={curation}
                    hoverClass="group-hover/curationItem:bg-neutral-300 group-hover/curationItem:dark:bg-neutral-700 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                  />
                ))}
              </div> 
            </div>
          )
          : null
        }
      </div>
    </div>
  );
}