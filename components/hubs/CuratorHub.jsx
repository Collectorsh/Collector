import React, { useEffect, useContext, useState, useCallback } from "react";
import UserContext from "/contexts/user";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export default function CuratorHub({ hub, allowed_users }) {
  const [user] = useContext(UserContext);
  const [backgroundImage, setBackgroundImage] = useState();
  const [canList, setCanList] = useState(false);

  useEffect(() => {
    // Get listings
  }, [hub]);

  useEffect(() => {
    if (!user) return;
    setCanList(allowed_users.includes(user.id));
  }, [allowed_users, user]);

  return (
    <div className="relative bg-black overflow-hidden">
      <div
        className="absolute -top-40 -left-20 -bottom-40 -right-20 opacity-40 object-center object-cover rotate-12"
        style={{
          backgroundImage: `url('https://cdn.collector.sh/${
            backgroundImage && backgroundImage
          }')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="h-96 lg:h-80 relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="float-left mt-4 sm:mt-12 w-full">
          <h1 className="text-3xl font-bold inline-block tracking-wide text-white">
            {hub.name}
          </h1>
          <p className="mt-4 text-white rounded xl:w-1/2">{hub.description}</p>
        </div>
      </div>
    </div>
  );
}
