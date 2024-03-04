import React from "react";


export default function HighlightedCurations({curations}) {

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 py-10 rounded-xl shadow">
      {curations?.length
        ? (
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
            <p className="font-bold text-3xl text-center collector">Highlighted Curations</p>
            <p className="textPalette2 text-center mb-8">These curations really knock our socks off</p>
            {/* <LandingCurationList curations={curations} withCurator/> */}
          </div>
        )
        : null
      }
    </div>
  );
}