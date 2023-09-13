import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import GalleryContainer from "/components/gallery/GalleryContainer";
import { Oval } from "react-loader-spinner";
import NotFound from "../../components/404";

export default function Search() {
  return <NotFound />

  const { address } = router.query;
  const [tokens, setTokens] = useState(); //useTokens instead
  const [notFound, setNotFound] = useState(false);

  // const initGetMetadata = useCallback(async (address) => {
  //   if (!address) return;

  //   try {
  //     let res = await getMetadata([address]);
  //     setTokens(res);
  //   } catch {
  //     setNotFound(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   initGetMetadata(address);
  // }, [address]);

  return (
    <div className="dark:bg-black">
      <MainNavigation publicKey={address} />
      <div className="dark:bg-black">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          {tokens && <GalleryContainer tokens={tokens} />}
          {!tokens && notFound && (
            <p className="dark:text-gray-100">
              We tried but we couldn&apos;t find any NFTs at this address.
            </p>
          )}
          {!tokens && !notFound && (
            <div className="mt-4 w-[50px] mx-auto h-64">
              <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
