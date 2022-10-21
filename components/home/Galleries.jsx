import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getNewestGalleries from "/data/home/getNewestGalleries";
import getPopularGalleries from "/data/home/getPopularGalleries";
import getDaos from "/data/home/getDaos";
import GalleryContent from "/components/home/GalleryContent";

export default function GalleriesPage() {
  const [newest, setNewest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [daos, setDaos] = useState([]);

  const fetchNewestGalleries = useCallback(async () => {
    let res = await getNewestGalleries();
    setNewest(res.data);
  }, []);

  const fetchPopularGalleries = useCallback(async () => {
    let res = await getPopularGalleries();
    setPopular(res.data);
  }, []);

  const fetchDaos = useCallback(async () => {
    let res = await getDaos();
    setDaos(res.data);
  }, []);

  useEffect(() => {
    fetchDaos();
    fetchNewestGalleries();
    fetchPopularGalleries();
  }, []);

  return (
    <div className="clear-both mt-12 sm:mt-24 mx-4 xl:mx-0">
      <h2 className="text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
        Galleries
      </h2>
      {/* <Link href="/galleries" title="View all Galleries">
        <a className="cursor-pointer text-black dark:text-white">
          <span className="underline">View all Galleries</span>
        </a>
      </Link> */}
      <div className="mt-6 sm:mt-12"></div>
      {daos && <GalleryContent name="Dao's &amp; Collectives" items={daos} />}
      {popular && <GalleryContent name="Popular Galleries" items={popular} />}
      {newest && <GalleryContent name="New Galleries" items={newest} />}
    </div>
  );
}
