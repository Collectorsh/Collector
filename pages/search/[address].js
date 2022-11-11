import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import GalleryContainer from "/components/gallery/GalleryContainer";
import getMetadata from "/data/nft/getMetadata";
import { Oval } from "react-loader-spinner";

export default function Search() {
  const router = useRouter();
  const { address } = router.query;
  const [tokens, setTokens] = useState();
  const [notFound, setNotFound] = useState(false);

  const initGetMetadata = useCallback(async (address) => {
    if (!address) return;

    try {
      let res = await getMetadata([address]);
      setTokens(res);
    } catch {
      setNotFound(true);
    }
  }, []);

  useEffect(() => {
    initGetMetadata(address);
  }, [address]);

  return (
    <div className="dark:bg-black">
      <MainNavigation publicKey={address} />
      <div className="max-w-7xl mx-auto">
        <div className="dark:bg-black">
          <div className="mx-auto px-4">
            <div className="mx-auto px-2 md:px-0">
              {tokens && <GalleryContainer tokens={tokens} />}
              {!tokens && notFound && (
                <p className="dark:text-gray-100">
                  We tried but we couldn&apos;t find any NFTs at this address.
                </p>
              )}
              {!tokens && !notFound && (
                <div className="mt-4 w-[50px] mx-auto h-64">
                  <Oval
                    color="#fff"
                    secondaryColor="#000"
                    height={50}
                    width={50}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
