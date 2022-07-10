import React, { useCallback, useContext, useState, useEffect } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import UserContext from "/contexts/user";
import MainNavigation from "/components/navigation/MainNavigation";
import getMetadata from "/data/nft/getMetadata";
import CollectionContainer from "/components/dashboard/gallery/CollectionContainer";
import { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";

export default function Collection() {
  const [user, setUser] = useContext(UserContext);
  const [tokens, setTokens] = useState();

  useEffect(() => {
    if (!user) return;
    initGetMetadata(user.public_keys);
  }, [user]);

  // After getting the user get their tokens using their public_keys
  const initGetMetadata = useCallback(async (publicKeys) => {
    if (!publicKeys) return;

    let res = await getMetadata(publicKeys);
    setTokens(res);
  }, []);

  return (
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <Toaster />
      <MainNavigation />

      <div>
        <div>
          {tokens ? (
            <CollectionContainer tkns={tokens} user={user} />
          ) : (
            <div className="mt-48 w-[50px] mx-auto h-64">
              <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
