import React from "react";
import LandingCurationItem  from "./curationItem";


export default function LandingHighlightedCurations({curations}) {

  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 py-10 rounded-xl shadow mb-20">
      {curations?.length
        ? (
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
            <p className="font-bold text-3xl text-center collector">Highlighted Curations</p>
            <p className="textPalette2 text-center mb-8">These curations really knock our socks off</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curations.map(curation => (
                <LandingCurationItem
                  key={curation.id}
                  curation={curation}
                  hoverClass="group-hover/curationItem:bg-zinc-300 group-hover/curationItem:dark:bg-zinc-700"
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