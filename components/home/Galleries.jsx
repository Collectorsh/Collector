import React, { useState, useEffect, useCallback } from "react";
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
    if (res) setNewest(res.data);
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
    <div className="clear-both mx-4 xl:mx-0 py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-neutral-800 w-full inline-block dark:text-whitish">
          Featured Galleries
        </h2>
        {/* <Link href="/galleries" title="View all Galleries">
        <a className="cursor-pointer text-black dark:text-white">
          <span className="underline">View all Galleries</span>
        </a>
      </Link> */}
        <div className="mt-6"></div>
        {daos && <GalleryContent name="Dao's &amp; Collectives" items={daos} />}
        {/* {popular && <GalleryContent name="Popular Galleries" items={popular} />}
        {newest && <GalleryContent name="New Galleries" items={newest} />} */}
      </div>
    </div>
  );
}
