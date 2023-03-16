import React, { useEffect, useState, useCallback } from "react";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getMintsById from "/data/artist/getMintsById";
import ArtistPage from "/components/artist/ArtistPage";
import MainNavigation from "/components/navigation/MainNavigation";

function Artist({ profileUser }) {
  const [mints, setMints] = useState();

  const fetchMints = useCallback(async (user_id) => {
    const res = await getMintsById(user_id);
    setMints({
      mints: res.data.mints,
      collections: res.data.collections,
      listings: res.data.listings,
    });
  }, []);

  useEffect(() => {
    if (!profileUser) return;
    fetchMints(profileUser.id);
  }, [profileUser]);

  return (
    <div>
      <MainNavigation />
      {profileUser && profileUser.artist ? (
        <ArtistPage mints={mints} profileUser={profileUser} />
      ) : (
        <p className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          We couldn&apos;t find an artist with that name
        </p>
      )}
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

export default Artist;
