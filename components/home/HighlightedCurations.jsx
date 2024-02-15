import React from "react";
import LandingCurationHighlight from "./LandingCurationHighlight";
import LandingCurationList from "./LandingCurationList";

export default function HighlightedCurations({curations}) {

  return (
    <div className="py-10 relative">
      {curations?.length
        ? (
          <>
            <LandingCurationHighlight curation={curations[0]} withCurator />
            <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
            <LandingCurationList curations={curations.slice(1)} withCurator/>
          </>
        )
        : null
      }
    </div>
  );
}