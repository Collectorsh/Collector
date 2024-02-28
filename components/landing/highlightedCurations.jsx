import React from "react";
import LandingCurationItem  from "./curationItem";


export default function LandingHighlightedCurations({curations}) {
  //bg-neutral-200 dark:bg-neutral-800  shadow 
  return (
    <div className="pb-12 pt-8 rounded-xl mb-20 bg-neutral-200 dark:bg-neutral-800 shadow-neutral-500/20 shadow mx-4 md:mx-8 2xl:mx-0">
      {curations?.length
        ? (
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
            <p className="font-bold text-3xl text-center collector mb-8">Featured</p>
            {/* <p className="textPalette2 text-center mb-8">These curations really knock our socks off</p> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
}