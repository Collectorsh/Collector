import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getNewestGalleries from "/data/home/getNewestGalleries";
import getPopularGalleries from "/data/home/getPopularGalleries";
import { Oval } from "react-loader-spinner";
import { cdnImage } from "/utils/cdnImage";

export default function GalleriesPage() {
  const [newest, setNewest] = useState([]);
  const [popular, setPopular] = useState([]);

  const fetchNewestGalleries = useCallback(async () => {
    let res = await getNewestGalleries();
    setNewest(res.data);
  }, []);

  const fetchPopularGalleries = useCallback(async () => {
    let res = await getPopularGalleries();
    setPopular(res.data);
  }, []);

  useEffect(() => {
    fetchNewestGalleries();
    fetchPopularGalleries();
  }, []);

  function addDefaultSource(e, url) {
    if (!url) return;
    e.target.src = url;
  }

  return (
    <>
      <div
        id="feed"
        className="mt-24 mb-12 bg-gray-50 dark:bg-dark1 p-4 rounded-lg mx-4 xl:mx-0"
      >
        <h2 className="text-xl font-bold text-black dark:text-whitish mb-6 text-gray-800 ml-2">
          Popular Galleries
        </h2>
        {popular.length === 0 && (
          <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
            <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
          </div>
        )}
        {popular.length > 0 && (
          <div className="items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
            {popular.map((item, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
              >
                <div className="rounded-lg overflow-hidden">
                  <Link href={`/${item.username}`}>
                    <a>
                      <img
                        src={cdnImage(item.mint)}
                        onError={(e) => addDefaultSource(e, item.image)}
                      />
                    </a>
                  </Link>
                </div>
                <Link href={`/${item.username}`}>
                  <a>
                    <h2 className="my-2 text-bold dark:text-white">
                      @{item.username}
                    </h2>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        id="feed"
        className="mt-24 mb-12 bg-gray-50 dark:bg-dark1 p-4 rounded-lg mx-4 xl:mx-0"
      >
        <h2 className="text-xl font-bold text-black dark:text-whitish mb-6 text-gray-800 ml-2">
          New Galleries
        </h2>
        {newest.length === 0 && (
          <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
            <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
          </div>
        )}
        {newest.length > 0 && (
          <div className="items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
            {newest.map((item, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
              >
                <div className="rounded-lg overflow-hidden">
                  <Link href={`/${item.username}`}>
                    <a>
                      <img
                        src={cdnImage(item.mint)}
                        onError={(e) => addDefaultSource(e, item.image)}
                      />
                    </a>
                  </Link>
                </div>
                <Link href={`/${item.username}`}>
                  <a>
                    <h2 className="my-2 text-bold dark:text-white">
                      @{item.username}
                    </h2>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
