import React, { useContext, useState } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import CollectorUsername from "/components/CollectorUsername";
import Collected from "/components/profile/Collected";
import Listings from "/components/profile/Listings";
import "tippy.js/dist/tippy.css";
import FollowingModal from "/components/profile/FollowingModal";
import SettingsMenu from "/components/navigation/SettingsMenu";
import NotFound from "../404";

function ProfilePage({
  profileUser,
  following,
  activity,
  image,
  refreshProfileImage,
}) {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  const [user] = useContext(UserContext);
  const [followingModal, setFollowingModal] = useState(false);

  function handleCloseModal() {
    setFollowingModal(false);
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
        <div className="w-16 h-16 mr-4 rounded-full -mt-8 ml-4 bg-neutral-100"></div>
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
                {/* <ViewGridIcon
                  className="h-5 w-5 inline mr-2"
                  aria-hidden="true"
                /> */}
                <span className="">View Gallery</span>
              </a>
            </Link>
          </div>

          {user && user.username === profileUser.username && (
            <div className="inline ml-16">
              <SettingsMenu username={user.username} />
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-xl">
            <span
              className="hover:cursor-pointer hover:underline"
              onClick={(e) => setFollowingModal(!followingModal)}
            >
              Following {following && following.length}
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
    </>
  );
}

export default ProfilePage;
