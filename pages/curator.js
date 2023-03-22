import React, { useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import UserContext from "/contexts/user";
import Artists from "/components/hubs/Artists";
import Settings from "/components/hubs/Settings";
import fetchCurator from "/data/hubs/fetchCurator";

export default function CuratorHub() {
  const router = useRouter();
  const [user] = useContext(UserContext);
  const [curator, setCurator] = useState({});
  const [selected, setSelected] = useState("artists");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  const asyncFetchCurator = useCallback(async (apiKey) => {
    // const res = await fetchCurator(apiKey);
    // if (res.status === "success") setCurator(res.curator);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!user.curator) router.push("/");
    asyncFetchCurator(user.api_key);
  }, [user]);

  return (
    <div>
      <CheckLoggedIn />
      <MainNavigation />
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-white">
              Curator Hub
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "artists" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("artists")}
                >
                  Artists
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "layout" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("art")}
                >
                  Art
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "settings" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("settings")}
                >
                  Settings
                </li>
              </ul>
            </div>
            {selected === "artists" && <Artists />}
            {selected === "settings" && <Settings curator={curator} />}
          </div>
        </div>
      </div>
    </div>
  );
}
