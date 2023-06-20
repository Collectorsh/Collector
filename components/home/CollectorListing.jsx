import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getCollectorListing from "/data/home/getCollectorListing";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Image from "/components/Image";
import ContentLoader from "react-content-loader";
import { roundToTwo } from "/utils/roundToTwo";

export default function CollectorListing() {
  const [metadata, setMetadata] = useState();

  const asyncGetCollectorListing = useCallback(async () => {
    let res = await getCollectorListing();
    let data = await getMetadataFromMint(res.mint);
    data.amount = res.amount;
    data.seller = res.seller;
    data.seller_twitter = res.seller_twitter;
    data.artist = res.artist;
    data.artist_twitter = res.artist_twitter;
    setMetadata(data);
  }, []);

  useEffect(() => {
    asyncGetCollectorListing();
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
                  {metadata.artist_twitter && (
                    <div>
                      <img
                        src={metadata.artist_twitter}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => removeElement(e)}
                      />
                    </div>
                  )}
                  {metadata.artist ? metadata.artist : "???"}
                </div>
              </div>
              <div className="col-span-1">
                <div className="font-semibold text-neutral-700 dark:text-neutral-200">
                  Seller
                </div>
                <div className="mt-2 font-bold text-black dark:text-white">
                  {metadata.seller_twitter && (
                    <div>
                      <img
                        src={metadata.seller_twitter}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => removeElement(e)}
                      />
                    </div>
                  )}
                  {metadata.seller ? metadata.seller : "???"}
                </div>
              </div>
            </div>
            <div className="mt-8 text-2xl font-bold">
              ◎{roundToTwo(metadata.amount / 1000000000)}
            </div>
            <div className="mt-16">
              <Link href={`/nft/${metadata.mint}`}>
                <a className="py-3.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold">
                  Buy Now
                </a>
              </Link>
            </div>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}
