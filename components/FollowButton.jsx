import React, { useContext, useEffect, useState } from "react";
import UserContext from "/contexts/user";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import FollowingContext from "/contexts/following";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

import { useWallet } from "@solana/wallet-adapter-react";
import { Program } from "@holaplex/graph-program";

const { getGraphProgram } = Program;
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const web3 = require("@solana/web3.js");

export default function FollowButton({ follow }) {
  const [user, setUser] = useContext(UserContext);
  const { wallet, publicKey } = useWallet();
  const [following, updateFollowing] = useContext(FollowingContext);
  const [isFollowing, setIsFollowing] = useState();

  const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), {
    commitment: "processed",
  });

  const followUser = async (targetPubKey) => {
    const graphProgram = getGraphProgram(
      new anchor.AnchorProvider(connection, wallet.adapter, {})
    );
    const txId = await graphProgram.methods
      .makeConnection(new PublicKey(targetPubKey))
      .accounts({ from: publicKey })
      .rpc();
    console.log(txId);
    updateFollowing(user.public_keys);
  };

  const unFollowUser = async (targetPubKey) => {};

  useEffect(() => {
    setIsFollowing(
      following.includes(
        follow.public_key ? follow.public_key : follow.public_keys[0]
      )
    );
  }, [following]);

  return (
    <>
      {user &&
        (follow.id || follow.user_id) &&
        user.id !== follow.id &&
        user.id !== follow.user_id && (
          <>
            {isFollowing ? (
              <Tippy
                content={`Stop following ${follow.username}`}
                className="bg-gray-300"
              >
                <MinusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-red-600 dark:hover:text-red-600"
                  aria-hidden="true"
                  onClick={() =>
                    unFollowUser(
                      follow.public_key
                        ? follow.public_key
                        : follow.public_keys[0]
                    )
                  }
                />
              </Tippy>
            ) : (
              <Tippy
                content={`Follow ${follow.username}`}
                className="bg-gray-300"
              >
                <PlusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-greeny hover:text-black dark:hover:text-white"
                  aria-hidden="true"
                  onClick={() =>
                    followUser(
                      follow.public_key
                        ? follow.public_key
                        : follow.public_keys[0]
                    )
                  }
                />
              </Tippy>
            )}
          </>
        )}
    </>
  );
}
