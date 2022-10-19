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
    <>
      <Link href="/galleries" title="View all Galleries">
        <a className="mt-6 mr-4 mb-2 sm:mr-0 sm:mt-8 bg-greeny float-right w-fit px-3 py-3 rounded-lg align-middle cursor-pointer text-slate-900 font-semibold">
          <span className="align-top">View all Galleries &gt;&gt;</span>
        </a>
      </Link>
      {daos && <GalleryContent name="Dao's &amp; Collectives" items={daos} />}
      {popular && <GalleryContent name="Popular Galleries" items={popular} />}
      {newest && <GalleryContent name="New Galleries" items={newest} />}
    </>
  );
}
