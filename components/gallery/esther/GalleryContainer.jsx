import React, { useEffect, useContext, useState } from "react";
import Card from "/components/gallery/esther/Card";
import { roundToTwo } from "/utils/roundToTwo";
import EstimatedValueContext from "/contexts/estimated_value";

export default function GalleryContainer({ tokens, user }) {
  const [runningTotal, setRunningTotal] = useState(0);
  const [totalEstimate] = useContext(EstimatedValueContext);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  useEffect(() => {
    let total = totalEstimate.reduce((a, b) => a + (b["estimate"] || 0), 0);
    setRunningTotal(total);
  }, [totalEstimate]);

  return (
    <div className="clear-both w-full mt-6">
      {user && user.estimated_value && (
        <div className="pb-8">
          <h2 className="text-base text-lg font-semibold leading-4 text-black dark:text-white inline">
            Estimated: ◎{roundToTwo(runningTotal / 1000000000)}
          </h2>
        </div>
      )}
      <div className="clear-both mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-center sm:justify-start">
          {Array.isArray(tokens) &&
            tokens
              .filter((t) => t.visible)
              .slice(0, 6)
              .map((token, index) => {
                return (
                  <div
                    key={index}
                    className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl"
                  >
                    <Card key={index} token={token} user={user} size={450} />
                  </div>
                );
              })}
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
          {Array.isArray(tokens) &&
            tokens
              .filter((t) => t.visible)
              .slice(6, 14)
              .map((token, index) => {
                return (
                  <div
                    key={index}
                    className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl"
                  >
                    <Card key={index} token={token} user={user} size={350} />
                  </div>
                );
              })}
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 justify-center sm:justify-start">
          {Array.isArray(tokens) &&
            tokens
              .filter((t) => t.visible)
              .slice(14)
              .map((token, index) => {
                return (
                  <div
                    key={index}
                    className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl"
                  >
                    <Card key={index} token={token} user={user} size={250} />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
