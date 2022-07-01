import React, { useState, useEffect, useCallback, useContext } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import ArtistList from "/components/dashboard/artists/ArtistList";
import getFollowing from "/data/artists/getFollowing";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import ArtistSearch from "/components/dashboard/artists/ArtistSearch";

export default function Artists() {
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

  const updateFollowing = (follow) => {
    setFollowing(follow);
  };

  return (
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <Toaster />
      <MainNavigation />
      <div className="mx-auto px-4">
        <div className="mx-auto px-2 md:px-0 mt-16 sm:mt-36">
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit py-1 inline-block dark:text-whitish">
            Artists
          </h2>
          <div className="mb-6">
            <ArtistSearch user={user} handleFollow={updateFollowing} />
          </div>
          {following && (
            <ArtistList
              following={following}
              handleFollow={updateFollowing}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}
