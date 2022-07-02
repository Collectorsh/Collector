import React, { useEffect, useState, useCallback } from "react";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getMetadata from "/data/nft/getMetadata";
import getUserFollows from "/data/user/getUserFollows";
import ProfilePage from "/components/profile/ProfilePage";
import MainNavigation from "/components/navigation/MainNavigation";

function Profile({ profileUser }) {
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();

  const fetchUserFollows = useCallback(async (user_id) => {
    const res = await getUserFollows(user_id);
    setFollowers(res.followers);
    setFollowing(res.following);
  }, []);

  useEffect(() => {
    fetchUserFollows(profileUser.id);
  }, [profileUser]);

  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="mx-auto px-4 md:px-8 clear-both">
        <div className="mx-auto px-2 pt-3 md:px-0">
          {profileUser ? (
            <ProfilePage
              following={following}
              followers={followers}
              profileUser={profileUser}
            />
          ) : (
            <p>We couldn&apos;t find a user with that name</p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let username = context.params.gallery;
    let res = await getUserFromUsername(username);
    let profileUser = res.user;
    // let tokens = await getMetadata(user.public_keys);
    return { props: { profileUser } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Profile;
