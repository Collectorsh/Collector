import React, { useEffect, useState, useCallback } from "react";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getFeed from "/data/home/getFeed";
import getUserFollows from "/data/user/getUserFollows";
import ProfilePage from "/components/profile/ProfilePage";
import MainNavigation from "/components/navigation/MainNavigation";

function Profile({ profileUser }) {
  const [activity, setActivity] = useState();
  const [image, setImage] = useState();
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();

  const fetchUserFollows = useCallback(async (user_id) => {
    const res = await getUserFollows(user_id);
    setFollowers(res.followers);
    setFollowing(res.following);
  }, []);

  const fetchFeed = useCallback(async (user_id) => {
    let res = await getFeed(user_id);
    setActivity(res.data);
    let resp = res.data.find((a) => a.type === "won" || a.type === "sale");
    setImage(resp.attributes.image);
  }, []);

  useEffect(() => {
    fetchUserFollows(profileUser.id);
    fetchFeed(profileUser.id);
  }, [profileUser]);

  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="px-4 xl:px-0 mx-auto clear-both">
        <div className="mx-auto pt-3 md:px-0">
          {profileUser ? (
            <ProfilePage
              following={following}
              followers={followers}
              profileUser={profileUser}
              activity={activity}
              image={image}
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
