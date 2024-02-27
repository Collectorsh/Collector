import React from "react";
import LandingCurationItem  from "./curationItem";


export default function LandingRecentCurations({curations}) {

  return (
    <div className="py-10 mb-20 border-zinc-200 dark:border-zinc-800 border-y-2"> 
      {curations?.length
        ? (
          <div className="max-w-screen-2xl mx-auto px-6">
            <p className="font-bold text-3xl text-center collector">Latest Curations</p>
            <p className="textPalette2 text-center mb-8">Hot off the presses</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
              {curations.map(curation => (
                <LandingCurationItem
                  key={curation.id}
                  curation={curation}
                  
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