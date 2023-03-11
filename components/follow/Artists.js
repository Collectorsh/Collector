import React, { useEffect, useCallback, useContext } from "react";
import getFollowing from "/data/artists/getFollowing";
import UserContext from "/contexts/user";
import FollowingContext from "/contexts/following";
import { Toaster } from "react-hot-toast";
import ArtistSearch from "/components/follow/ArtistSearch";
import ArtistList from "/components/follow/ArtistList";

export default function Artists() {
  const [user] = useContext(UserContext);
  const [following, setFollowing] = useContext(FollowingContext);

  const initGetFollowing = useCallback(async (apiKey) => {
    let res = await getFollowing(apiKey);
    if (res.status === "success") setFollowing(res.following);
  }, []);

  useEffect(() => {
    if (!user) return;
    initGetFollowing(user.api_key);
  }, [initGetFollowing, user]);

  return (
    <>
      <Toaster />
      <div>
        <div className="mt=8 lg:mt-16">
          <div className="mb-6">
            <ArtistSearch user={user} />
          </div>
          {following && <ArtistList />}
        </div>
      </div>
    </>
  );
}
