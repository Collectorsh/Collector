import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import Image from "/components/Image";
import GridView from "/components/GridView";

export default function Collected({ activity }) {
  const [results, setResults] = useState();

  useEffect(() => {
    if (!activity) return;
    let res = activity.filter((a) => a.type === "won" || a.type === "sale");
    setResults(res);
  }, [activity]);

  return (
    <>
      {results && (
        <div className="mt-10 mb-10">
          <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
            Collected
          </h2>
          <GridView items={results.slice(0, 12)} type="collected" />
        </div>
      )}
    </>
  );
}
