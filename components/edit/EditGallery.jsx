import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "/contexts/user";
import getMetadata from "/data/nft/getMetadata";
import { Oval } from "react-loader-spinner";
import Gallery from "./dnd/Gallery";
import { useRouter } from "next/router";
import getMetadataFromUri from "../../data/nft/getMetadataFromUri";

export default function EditGallery() {
  const [user] = useContext(UserContext);
  const [tokens, setTokens] = useState();
  const router = useRouter();

  const getTokens = useCallback(async (u) => {
    let tkns = await getMetadata(u.public_keys);
    setTokens(tkns);
  }, []);

  useEffect(() => {
    if (user) {
      getTokens(user);
    }
  }, [user, getTokens]);

  return (
    <div className="dark:bg-black mt-2 pb-12">
      {tokens && user ? (
        <Gallery tokens={tokens} user={user} />
      ) : (
        <div className="mt-4 w-[50px] mx-auto h-64">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
    </div>
  );
}
