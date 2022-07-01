import React, { useEffect, useContext, useCallback } from "react";
import CollectorUsername from "/components/CollectorUsername";
import Link from "next/link";
import Activity from "/components/profile/Activity";

function ProfilePage({ profileUser, following, followers }) {
  return (
    <>
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
        {profileUser.twitter_screen_name && (
          <p className="mr-2">
            <Link
              href={`https://twitter.com/${profileUser.twitter_screen_name}`}
            >
              <a>@{profileUser.twitter_screen_name}</a>
            </Link>
          </p>
        )}
        <div>
          <p>{followers && followers.length}</p>
          <p>Followers</p>
        </div>
        <div>
          <p>{following && following.length}</p>
          <p>Following</p>
        </div>
      </div>
      <Activity user={profileUser} />
    </>
  );
}

export default ProfilePage;
