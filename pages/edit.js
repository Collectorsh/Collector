import React, { useState } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import EditGallery from "/components/edit/EditGallery";
import MainNavigation from "/components/navigation/MainNavigation";
import Settings from "/components/edit/Settings";

function Gallery() {
  const [selected, setSelected] = useState("gallery");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div className="dark:bg-black dark:text-whitish">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto relative">
        <MainNavigation />
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
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
    </div>
  );
}

export default Gallery;
