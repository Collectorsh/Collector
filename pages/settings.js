import React, { useState } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import Settings from "/components/settings/Settings";
import Wallets from "/components/settings/Wallets";
import Notifications from "/components/settings/Notifications";

function SettingsPage() {
  const [selected, setSelected] = useState("settings");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div className="dark:bg-black dark:text-whitish">
      <CheckLoggedIn />
      <MainNavigation />
      <div className="max-w-7xl mx-auto relative">
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Edit Profile
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "settings" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("settings")}
                >
                  Settings
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "notifications" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("notifications")}
                >
                  Notifications
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "wallets" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("wallets")}
                >
                  Wallets
                </li>
              </ul>
            </div>
            {selected === "settings" && <Settings />}
            {selected === "notifications" && <Notifications />}
            {selected === "wallets" && <Wallets />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
