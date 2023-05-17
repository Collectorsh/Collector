import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getGalleryImages from "/data/home/getGalleryImages";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Image from "/components/Image";
import ContentLoader from "react-content-loader";

export default function GalleryImages() {
  const [metadata, setMetadata] = useState();

  const asyncGetGalleryImages = useCallback(async () => {
    let res = await getGalleryImages();
    let data = await getMetadataFromMint(res.mint);
    data.username = res.username;
    data.twitter = res.twitter;
    setMetadata(data);
  }, []);

  useEffect(() => {
    asyncGetGalleryImages();
  }, []);

  const removeElement = (e) => {
    e.target.parentNode.remove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 mb-6">
      {metadata ? (
        <>
          <div className="lg:col-span-6">
            <div className="text-center">
              <div className="overflow-hidden col-span-2 relative -mt-2 max-h-[100vw] lg:max-h-[520px] xl:max-h-[550px] rounded-xl">
                <Image token={metadata} size="large" />
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:col-span-5 lg:col-end-13">
            <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
              {metadata.name}
            </h2>
            <p className="mt-4 max-h-52 overflow-hidden">
              {metadata.description}
            </p>
            <div className="mt-8 grid grid-cols-2">
              <div className="col-span-1">
                <div className="font-semibold text-neutral-700 dark:text-neutral-200">
                  Artist
                </div>
                <div className="mt-2 font-bold text-black dark:text-white">
                  {metadata.artist_twitter_image && (
                    <div>
                      <img
                        src={metadata.artist_twitter_image}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => removeElement(e)}
                      />
                    </div>
                  )}
                  {metadata.artist_name ? metadata.artist_name : "???"}
                </div>
                <div className="mt-16">
                  <Link href={`/nft/${metadata.mint}`}>
                    <a className="py-3.5 px-4 rounded-3xl border-2 border-black dark:border-white text-black dark:text-white cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold">
                      View Artwork
                    </a>
                  </Link>
                </div>
              </div>
              <div className="col-span-1">
                <div className="font-semibold text-neutral-700 dark:text-neutral-200">
                  Collector
                </div>
                <div className="mt-2 font-bold text-black dark:text-white">
                  {metadata.twitter && (
                    <div>
                      <img
                        src={metadata.twitter}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => removeElement(e)}
                      />
                    </div>
                  )}
                  {metadata.username}
                </div>
                <div className="mt-16">
                  <Link href={`/${metadata.username}`}>
                    <a className="py-3.5 px-4 rounded-3xl border-2 border-black dark:border-white text-black dark:text-white cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold">
                      View Gallery
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="lg:col-span-6">
          <ContentLoader
            speed={2}
            className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] rounded-xl"
            backgroundColor="#bbbbbb"
            foregroundColor="#aaaaaa"
          >
            <rect className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]" />
          </ContentLoader>
        </div>
      )}
    </div>
  );
}
