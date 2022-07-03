import React, { useContext } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import CollectorUsername from "/components/CollectorUsername";
import Collected from "/components/profile/Collected";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

function ProfilePage({ profileUser, following, followers, activity, image }) {
  const [user, setUser] = useContext(UserContext);

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  return (
    <div className="mt-[74px]">
      <div
        className="h-48 w-full bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {profileUser.twitter_profile_image && (
        <img
          src={profileUser.twitter_profile_image}
          className="w-16 h-16 mr-4 rounded-full -mt-8 ml-4"
        />
      )}

      <div className="mb-0">
        {profileUser.username && (
          <p className="inline mr-2 text-2xl">
            <CollectorUsername username={profileUser.username} />
          </p>
        )}
        {user && user.username !== profileUser.username && (
          <div className="float-right">
            {user.following &&
            user.following.find((f) => f.id === profileUser.id) ? (
              <Tippy
                content={`Stop following ${profileUser.username}`}
                className="bg-gray-300"
              >
                <button
                  className="align-top cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-2 px-3 font-bold border border-4 bg-white text-black border-black hover:border-red-700 dark:hover:border-red-800 dark:bg-black dark:text-whitish dark:border-whitish"
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
                  className="align-top cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-2 px-3 font-bold border border-4 bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish"
                  onClick={() => followUser(profileUser.id, "follow")}
                >
                  + Follow
                </button>
              </Tippy>
            )}
          </div>
        )}
        <div className="mt-3">
          <p className="text-xl">
            <span>{followers && followers.length} Followers</span> &middot;{" "}
            <span>{following && following.length} Following</span>
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-4xl font-extrabold text-black w-fit inline-block dark:text-white mb-6">
          Gallery
        </h2>
        <p className="">
          <Link href={`/${profileUser.username}`}>
            <a className="text-xl hover:underline">View Galley</a>
          </Link>
        </p>
      </div>

      <div className="mt-10">
        {activity && <Collected activity={activity} />}
      </div>
    </div>
  );
}

export default ProfilePage;
