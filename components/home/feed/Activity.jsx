import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "/contexts/user";
import FollowingContext from "/contexts/following";
import getFeed from "/data/home/getFeed";
import getFollowing from "/data/artists/getFollowing";
import Details from "/components/home/feed/Details";
import Masonry from "react-masonry-css";
import { Oval } from "react-loader-spinner";

export default function Activity() {
  const [user] = useContext(UserContext);
  const [, setFollowing] = useContext(FollowingContext);
  const [activity, setActivity] = useState();

  const initGetFollowing = useCallback(async (apiKey) => {
    let res = await getFollowing(apiKey);
    if (res.status === "success") setFollowing(res.following);
  }, []);

  useEffect(() => {
    if (!user) return;
    initGetFollowing(user.api_key);
  }, [initGetFollowing, user]);

  const fetchFeed = useCallback(async () => {
    let res = await getFeed();
    if (res) setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div>
      {!activity && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {activity && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid -ml-16"
          columnClassName="masonry-grid_column pl-16"
        >
          {activity.map((item, index) => (
            <div key={index}>
              <Details item={item} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
