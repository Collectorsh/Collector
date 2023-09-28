import React from "react";
import CurationHighlight from "../curatorProfile/curationHighlight";
import CurationList from "../curatorProfile/curationList";

export default function HighlightedCurations({curations}) {

  return (
    <div className="py-10 relative">
      {curations?.length
        ? (
          <>
            <CurationHighlight curation={curations[0]} withCurator />
            <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
            <CurationList curations={curations.slice(1)} withCurator/>
          </>
        )
        : null
      }
    </div>
  );
}