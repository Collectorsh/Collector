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
    <div className="clear-both py-6">
      <h2 className="text-2xl font-semibold text-neutral-800 w-full inline-block dark:text-whitish">
        Featured Galleries
      </h2>
      <p className="font-semibold mb-2 hover:underline dark:text-white">
        <Link href="/galleries">
          <a>See all Galleries</a>
        </Link>
        <ArrowRightIcon
          className="h-4 w-4 ml-1 inline cursor-pointer"
          aria-hidden="true"
        />
      </p>
      <GalleryContent name="Dao's &amp; Collectives" items={daos} />
      <GalleryContent name="Popular Galleries" items={popular} />
    </div>
  );
}
