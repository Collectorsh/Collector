import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "/contexts/user";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import getFollowing from "/data/artists/getFollowing";
import followArtist from "/data/artists/followArtist";
import unfollowArtist from "/data/artists/unfollowArtist";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

export default function FollowButton({ follow }) {
  const [user, setUser] = useContext(UserContext);
  const [following, setFollowing] = useState();

  const initGetFollowing = useCallback(async (apiKey) => {
    let res = await getFollowing(apiKey);
    if (res.status === "success") setFollowing(res.following);
  }, []);

  useEffect(() => {
    if (!user) return;
    initGetFollowing(user.api_key);
  }, [initGetFollowing, user]);

  const doUnfollowArtist = async (artist) => {
    const res = await unfollowArtist(user.api_key, artist);
    setFollowing(res.following);
  };

  const doFollowArtist = async (artist) => {
    const res = await followArtist(user.api_key, artist);
    setFollowing(res.following);
  };

  return (
    <>
      {user && (
        <>
          {following &&
          following.find((f) => f.artist === follow.artist_name) ? (
            <Tippy
              content={`Stop following ${follow.artist_name}`}
              className="bg-gray-300"
            >
              <MinusCircleIcon
                className="inline h-8 w-8 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-red-600 dark:hover:text-red-600"
                aria-hidden="true"
                onClick={() => doUnfollowArtist(follow.artist_name)}
              />
            </Tippy>
          ) : (
            <Tippy
              content={`Follow ${follow.artist_name}`}
              className="bg-gray-300"
            >
              <PlusCircleIcon
                className="inline h-8 w-8 cursor-pointer outline-none text-greeny hover:text-black dark:hover:text-white"
                aria-hidden="true"
                onClick={() => doFollowArtist(follow.artist_name)}
              />
            </Tippy>
          )}
        </>
      )}
    </>
  );
}
