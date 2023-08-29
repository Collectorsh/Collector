import React, { useState, useEffect, useCallback } from "react";
import getHighlightedCurations from "../../data/curation/getHighlightedCurations";
import CurationHighlight from "../curatorProfile/curationHighlight";

export default function HighlightedCurations() {
  const [curations, setCurations] = useState(null);
  console.log("🚀 ~ file: HighlightedCurations.jsx:7 ~ HighlightedCurations ~ curations:", curations)

  const fetchCurated = useCallback(async () => {
    const res = await getHighlightedCurations()
    if (res) setCurations(res)
  }, [])

  useEffect(() => {
    fetchCurated()
  }, [fetchCurated])

  return (
    <div className="py-10">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-neutral-800 dark:text-whitish mb-8 collector">
          Curation Highlight
        </h2>
      </div>
      {curations?.length
        ? (<CurationHighlight curation={curations[0]} withCurator/>)
        : null
      }
    </div>
  );
}