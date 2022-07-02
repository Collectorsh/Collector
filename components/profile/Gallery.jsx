import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "/components/Image";

export default function Gallery({ user, activity }) {
  const [results, setResults] = useState();

  useEffect(() => {
    if (!activity) return;
    let res = activity.filter((a) => a.type === "won" || a.type === "sale");
    setResults(res.slice(0, 5));
  }, [activity]);

  return (
    <div className="mt-0">
      <h2 className="text-5xl font-extrabold text-black w-fit inline-block dark:text-white mt-16">
        Gallery
      </h2>
      <p className="mt-2 mb-6 underline">
        <Link href={`/${user.username}`}>
          <a>Browse {user.username}&apos;s full Collection</a>
        </Link>
      </p>
      <div>
        {results &&
          results.map((item, index) => (
            <div key={index} className="mb-6">
              <Image token={{ image: item.attributes.image }} />
            </div>
          ))}
      </div>
    </div>
  );
}
