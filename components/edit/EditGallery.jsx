import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "/contexts/user";
import getMetadata from "/data/nft/getMetadata";
import { Oval } from "react-loader-spinner";
import Gallery from "./dnd/Gallery";
import { useRouter } from "next/router";
import getMetadataFromUri from "../../data/nft/getMetadataFromUri";
import { useMetadata } from "/data/nft/getMetadata";

export default function EditGallery() {
  const [user] = useContext(UserContext);
  // const [tokens, setTokens] = useState();
  const tokens = useMetadata(user?.public_keys);

  return (
    <div className="dark:bg-black mt-2 pb-12">
      {tokens && user ? (
        <Gallery tokens={tokens} user={user} />
      ) : (
        <h1 className="animate-pulse font-bold text-4xl text-center mt-[15%]">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
      )}
    </div>
  );
}
