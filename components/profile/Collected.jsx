import React, { useState, useEffect } from "react";
import GridView from "/components/GridView";

export default function Collected({
  activity,
  profileUser,
  refreshProfileImage,
}) {
  const [results, setResults] = useState();

  useEffect(() => {
    if (!activity) return;
    let res = activity.filter((a) => a.type === "won" || a.type === "sale");
    setResults(res);
  }, [activity]);

  return (
    <>
      {results && results.length > 0 && (
        <div className="mt-10 pb-10">
          <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white">
            Collected
          </h2>
          <div className="w-full border-b border-gray-200 dark:border-dark3 mt-3 mb-6"></div>
          <GridView
            items={results.slice(0, 12)}
            type="collected"
            profileUser={profileUser}
            refreshProfileImage={refreshProfileImage}
          />
        </div>
      )}
    </>
  );
}
