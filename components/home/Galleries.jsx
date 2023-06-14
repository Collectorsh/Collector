import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getPopularGalleries from "/data/home/getPopularGalleries";
import getDaos from "/data/home/getDaos";
import { ArrowRightIcon } from "@heroicons/react/outline";
import GalleryContent from "/components/home/GalleryContent";
import getCuratedGalleries from "/data/home/getCuratedGalleries";

export default function GalleriesPage() {
  const [popular, setPopular] = useState();
  const [daos, setDaos] = useState();
  const [curated, setCurated] = useState();

  const fetchCurated = useCallback(async () => { 
    const res = await getCuratedGalleries()
    const randomized = res.data.sort(() => Math.random() - 0.5)
    if (res) setCurated([...randomized, ...randomized])
  }, [])
  
  useEffect(() => {
    fetchCurated()
  }, [fetchCurated])

  return (
    <div className="py-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-whitish">
          Featured Galleries
        </h2>
        <p className="font-semibold hover:underline dark:text-white">
          <Link href="/discover">
            <a>See all Galleries</a>
          </Link>
          <ArrowRightIcon
            className="h-4 w-4 ml-1 inline cursor-pointer"
            aria-hidden="true"
          />
        </p>
      </div>
      {/* <GalleryContent name="Dao's &amp; Collectives" items={daos} />
      <GalleryContent name="Popular Galleries" items={popular} /> */}
      <GalleryContent name="" items={curated} />
    </div>
  );
}
