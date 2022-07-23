import React, { useContext, useState } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import CollectorUsername from "/components/CollectorUsername";
import Collected from "/components/profile/Collected";
import Listings from "/components/profile/Listings";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ViewGridIcon, CogIcon } from "@heroicons/react/outline";
import FollowingModal from "/components/profile/FollowingModal";
import FollowersModal from "/components/profile/FollowersModal";
import SettingsMenu from "/components/navigation/SettingsMenu";

function ProfilePage({
  profileUser,
  following,
  followers,
  activity,
  image,
  refreshProfileImage,
}) {
  const [user, setUser] = useContext(UserContext);
  const [followingModal, setFollowingModal] = useState(false);
  const [followersModal, setFollowersModal] = useState(false);

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  function handleCloseModal() {
    setFollowingModal(false);
    setFollowersModal(false);
  }

  return (
    <>
      <div
        className="h-48 w-full bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {profileUser.twitter_profile_image ? (
        <img
          src={profileUser.twitter_profile_image}
          className="w-16 h-16 mr-4 rounded-full -mt-8 ml-4"
        />
      ) : (
        <div className="w-16 h-16 mr-4 rounded-full -mt-8 ml-4 bg-gray-100"></div>
      )}

      <div className="mb-0">
        {profileUser.username && (
          <p className="inline mr-2 text-2xl">
            <CollectorUsername username={profileUser.username} />
          </p>
        )}

        <div className="float-right relative">
          <div className="inline">
            <Link href={`/${profileUser.username}`}>
              <a className="align-middle cursor-pointer rounded-3xl text-sm xl:text-md py-2.5 px-3 font-bold border border-4 bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish">
                <ViewGridIcon
                  className="h-5 w-5 inline mr-2"
                  aria-hidden="true"
                />
                <span className="">View Galley</span>
              </a>
            </Link>
          </div>

          {user && user.username === profileUser.username && (
            <div className="inline ml-16">
              <SettingsMenu username={user.username} />
            </div>
          )}

          {user && user.username !== profileUser.username && (
            <div className="inline ml-4">
              {user.following &&
              user.following.find((f) => f.id === profileUser.id) ? (
                <Tippy
                  content={`Stop following ${profileUser.username}`}
                  className="bg-gray-300"
                >
                  <button
                    className="cursor-pointer rounded-3xl text-sm xl:text-md py-2 px-3 font-bold border border-4 bg-white text-black border-black hover:border-red-700 dark:hover:border-red-800 dark:bg-black dark:text-whitish dark:border-whitish"
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
                    className="cursor-pointer rounded-3xl text-sm xl:text-md py-2 px-3 font-bold border border-4 bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish"
                    onClick={() => followUser(profileUser.id, "follow")}
                  >
                    + Follow
                  </button>
                </Tippy>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-xl">
            <span
              className="hover:cursor-pointer hover:underline"
              onClick={(e) => setFollowersModal(!followersModal)}
            >
              {followers && followers.length} Followers
            </span>{" "}
            &middot;{" "}
            <span
              className="hover:cursor-pointer hover:underline"
              onClick={(e) => setFollowingModal(!followingModal)}
            >
              {following && following.length} Following
            </span>
          </p>
        </div>
      </div>

      {profileUser && <Listings user={profileUser} />}
      {profileUser && activity && (
        <Collected
          activity={activity}
          profileUser={profileUser}
          refreshProfileImage={refreshProfileImage}
        />
      )}

      <FollowingModal
        open={followingModal}
        closeModal={handleCloseModal}
        following={following}
      />

      <FollowersModal
        open={followersModal}
        closeModal={handleCloseModal}
        followers={followers}
      />
    </>
  );
}

export default ProfilePage;
