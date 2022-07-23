import React, { useState } from "react";
import Link from "next/link";
import getUserFromUsername from "/data/user/getUserFromUsername";
import Following from "/components/profile/activity/Following";
import Bids from "/components/profile/activity/Bids";
import MainNavigation from "/components/navigation/MainNavigation";
import CheckLoggedIn from "/components/CheckLoggedIn";

function Activity({ profileUser }) {
  const [selected, setSelected] = useState("following");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div className="dark:bg-black dark:text-whitish">
      <CheckLoggedIn profileUser={profileUser} />
      <div className="max-w-7xl mx-auto relative">
        <MainNavigation />
        <div className="absolute right-4 mt-4 rounded-full h-8 w-8 text-3xl text-gray-400 cursor-pointer">
          <Link href={`/${profileUser.username}/profile`}>
            <a>x</a>
          </Link>
        </div>
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Activity
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "following" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("following")}
                >
                  Following
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "bids" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("bids")}
                >
                  Bids
                </li>
              </ul>
            </div>
            {selected === "following" && <Following />}
            {selected === "bids" && <Bids />}
          </div>
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

export default Activity;
