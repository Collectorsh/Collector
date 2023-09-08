import React, { useEffect, useState, useCallback } from "react";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getFeed from "/data/home/getFeed";
import getFollowingById from "/data/artists/getFollowingById";
import ProfilePage from "/components/profile/ProfilePage";
import MainNavigation from "/components/navigation/MainNavigation";
import { useRouter } from "next/router";
import NotFound from "../../components/404";

function Profile({ profileUser }) {
  return <NotFound />

  const [activity, setActivity] = useState();
  const [image, setImage] = useState();
  const [following, setFollowing] = useState();

  const fetchUserFollows = useCallback(async (user_id) => {
    const res = await getFollowingById(user_id);
    setFollowing(res.following);
  }, []);

  const fetchFeed = useCallback(async (profileUser) => {
    let res = await getFeed(profileUser.id);
    setActivity(res.data);

    if (profileUser.profile_image) {
      setImage(profileUser.profile_image);
    } else {
      let resp = res.data.find((a) => a.type === "won" || a.type === "sale");
      if (resp) {
        setImage(resp.attributes.image);
      } else {
        setImage(
          "https://formfunction.imgix.net/nft-images/6AgwnaqCaQ9tlZhfuslnD.jpeg?q=70&auto=format&auto=compress"
        );
      }
    }
  }, []);

  useEffect(() => {
    fetchUserFollows(profileUser.id);
    fetchFeed(profileUser);
  }, [profileUser]);

  const refreshProfileImage = (img) => {
    setImage(img);
  };

  return (
    <div>
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3 md:px-0">
          {profileUser ? (
            <ProfilePage
              following={following}
              profileUser={profileUser}
              activity={activity}
              image={image}
              refreshProfileImage={refreshProfileImage}
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
    return { props: { profileUser } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Profile;
