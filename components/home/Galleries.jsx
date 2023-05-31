import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getPopularGalleries from "/data/home/getPopularGalleries";
import getDaos from "/data/home/getDaos";
import { ArrowRightIcon } from "@heroicons/react/outline";
import GalleryContent from "/components/home/GalleryContent";

export default function GalleriesPage() {
  const [popular, setPopular] = useState();
  const [daos, setDaos] = useState();

  const fetchPopularGalleries = useCallback(async () => {
    let res = await getPopularGalleries();
    if (res) setPopular(res.data);
  }, []);

  const fetchDaos = useCallback(async () => {
    let res = await getDaos();
    if (res) setDaos(res.data);
  }, []);

  useEffect(() => {
    fetchDaos();
    fetchPopularGalleries();
  }, []);

  return (
    <div className="py-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-whitish">
          Featured Galleries
        </h2>
        <p className="font-semibold hover:underline dark:text-white">
          <Link href="/galleries">
            <a>See all Galleries</a>
          </Link>
          <ArrowRightIcon
            className="h-4 w-4 ml-1 inline cursor-pointer"
            aria-hidden="true"
          />
        </p>
      </div>
      <GalleryContent name="Dao's &amp; Collectives" items={daos} />
      <GalleryContent name="Popular Galleries" items={popular} />
    </div>
  );
}
