import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Buynow from "/components/activity/Buynow";
import Following from "/components/activity/Following";
import Bids from "/components/activity/Bids";
import MainNavigation from "/components/navigation/MainNavigation";
import CheckLoggedIn from "/components/CheckLoggedIn";
import Artists from "/components/follow/Artists";

function Activity() {
  const router = useRouter();
  const { id } = router.query;
  const [selected, setSelected] = useState(id || "buynow");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  useEffect(() => {
    setSelected(id);
  }, [id]);

  return (
    <div className="dark:bg-black dark:text-whitish">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto relative">
        <MainNavigation />
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Collect
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "buynow" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("buynow")}
                >
                  Buy Now
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "following" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("following")}
                >
                  Auctions
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "bids" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("bids")}
                >
                  My Bids
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "follow" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("follow")}
                >
                  Follow Artists
                </li>
              </ul>
            </div>
            {selected === "buynow" && <Buynow />}
            {selected === "following" && <Following />}
            {selected === "bids" && <Bids />}
            {selected === "follow" && <Artists />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;
