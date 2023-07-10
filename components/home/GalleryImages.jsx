import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getGalleryImages from "/data/home/getGalleryImages";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Image from "/components/Image";
import ContentLoader from "react-content-loader";


export default function GalleryImages() {
  const [metadata, setMetadata] = useState();
  const [error, setError] = useState(0);

  const asyncGetGalleryImages = useCallback(async () => {
    try {
      let res = await getGalleryImages();

      if (!res.mint) throw new Error("No Mint address")

      let data = await getMetadataFromMint(res.mint);


      if (data && res) {
        data.username = res.username;
        data.twitter = res.twitter;

        setMetadata(data);
        setError(0)
      } else {
        setError(prev => prev+1);
      }
    } catch (e) {
      setError(prev => prev+1);
    }
  }, []);

  useEffect(() => {
    asyncGetGalleryImages();
  }, []);

  useEffect(() => {
    //if error try again
    if (error !== 0 && error < 9) {
      asyncGetGalleryImages();
    }
  },[error])

  const removeElement = (e) => {
    e.target.parentNode.remove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 pb-12">
      {metadata ? (
        <>
          <div className="lg:col-span-6">
            <div className="text-center">
              <div className="overflow-hidden col-span-2 relative -mt-2 max-h-[300px] lg:max-h-[520px] xl:max-h-[550px] rounded-xl flex justify-center items-center">
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
                    <a className="py-3.5 px-4 rounded-lg border-2 duration-300 border-black dark:border-white text-black dark:text-white cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold">
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
                    <a className="py-3.5 px-4 duration-300 rounded-lg border-2 border-black dark:border-white text-black dark:text-white cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold">
                      View Gallery
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
      <>
        <div className="lg:col-span-6">
          <ContentLoader
            speed={2}
            className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] rounded-xl"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]" />
          </ContentLoader>
        </div>
        <div className="hidden lg:block lg:col-span-5 lg:col-end-13 min-h-[50%]">
          <ContentLoader
            speed={2}
            className="w-full lg:h-[520px] xl:h-[550px]"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect y="3%" className="w-full h-10" rx="7" />
            <rect y="15%" className="w-full h-4" rx="5" />
            <rect y="20%" className="w-full h-4" rx="5" />
            <rect y="25%" className="w-full h-4" rx="5" />

                <rect y="35%" className="w-[45%] h-4" rx="5" />
                <rect y="35%" x="50%" className="w-[45%] h-4" rx="5" />
                <rect y="40%" className="w-[45%] h-4" rx="5" />
                <rect y="40%" x="50%" className="w-[45%] h-4" rx="5" />

            <rect y="50%" className="w-1/3 h-10" rx="5" />
            <rect y="50%" x="50%" className="w-1/3 h-10" rx="5" />
          </ContentLoader>
        </div>
      </>
      )}
    </div>
  );
}
