import React, { useEffect, useCallback, useState, useContext } from "react";
import UserContext from "/contexts/user";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import CollectorUsername from "/components/CollectorUsername";
import Activity from "/components/profile/Activity";
import Gallery from "/components/profile/Gallery";
import getFeed from "/data/home/getFeed";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

function ProfilePage({ profileUser, following, followers }) {
  const [activity, setActivity] = useState();
  const [user, setUser] = useContext(UserContext);

  const fetchFeed = useCallback(async (user_id) => {
    let res = await getFeed(user_id);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed(profileUser.id);
  }, [profileUser]);

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  return (
    <div className="mt-[74px]">
      {profileUser.twitter_profile_image && (
        <img
          src={profileUser.twitter_profile_image}
          className="w-12 h-12 mr-4 float-left rounded-full"
        />
      )}

      <div className="mb-0">
        {profileUser.username && (
          <p className="inline mr-2 text-2xl">
            <CollectorUsername username={profileUser.username} />
          </p>
        )}
        {user && user.username !== profileUser.username && (
          <>
            {user.following &&
            user.following.find((f) => f.id === profileUser.id) ? (
              <Tippy
                content={`Stop following ${profileUser.username}`}
                className="bg-gray-300"
              >
                <button
                  className="align-top cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-2 font-bold border border-4 bg-white text-black border-black hover:border-red-700 dark:hover:border-red-800 dark:bg-black dark:text-whitish dark:border-whitish"
                  onClick={() => followUser(profileUser.id, "unfollow")}
                >
                  Following
                </button>
              </Tippy>
            ) : (
              <Tippy
                content={`Follow ${profileUser.username}`}
                className="bg-gray-300"
              >
                <button
                  className="align-top cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-2 font-bold border border-4 bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish"
                  onClick={() => followUser(profileUser.id, "follow")}
                >
                  + Follow
                </button>
              </Tippy>
            )}
          </>
        )}
        <div className="mt-6">
          <p>
            <span className="underline">
              {followers && followers.length} Followers
            </span>{" "}
            &middot;{" "}
            <span className="underline">
              {following && following.length} Following
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl grid grid-cols-1 md:grid-cols-6 px-4 min-h-screen relative">
        <div
          id="feed"
          className="col-span-1 md:col-span-3 order-last md:order-first"
        >
          {activity && <Activity activity={activity} />}
        </div>
        <div className="col-span-1 md:col-span-2 md:col-start-5 order-first md:order-last">
          <Gallery user={profileUser} activity={activity} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
