import React, { useState } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import EditGallery from "/components/edit/EditGallery";
import MainNavigation from "/components/navigation/MainNavigation";
import Settings from "/components/edit/Settings";

function Edit() {
  const [selected, setSelected] = useState("gallery");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div>
      <CheckLoggedIn />
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
            Edit Gallery
          </h2>
          <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
            <ul className="font-bold">
              <li
                className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                  selected === "gallery" &&
                  "text-greeny font-extrabold border-b border-b-2 border-greeny"
                }`}
                onClick={() => changeSelected("gallery")}
              >
                Gallery
              </li>
              <li
                className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                  selected === "settings" &&
                  "text-greeny font-extrabold border-b border-b-2 border-greeny"
                }`}
                onClick={() => changeSelected("settings")}
              >
                Settings
              </li>
            </ul>
          </div>
          {selected === "gallery" && <EditGallery />}
          {selected === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default Edit;
