import React, { useState } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import EditGallery from "/components/edit/EditGallery";
import MainNavigation from "/components/navigation/MainNavigation";
import Settings from "/components/edit/Settings";
import clsx from "clsx";
import NotFound from "../../components/404";

function Edit() {
  return <NotFound />
  const [selected, setSelected] = useState("gallery");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div>
      {/* <CheckLoggedIn /> */}
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="collector mt-8 mb-12 text-5xl font-semibold text-neutral-800 w-full py-1 inline-block dark:text-whitish">
            Edit Gallery
          </h2>
          <div className="w-full border-b border-neutral-200 dark:border-dark3">
            <div className="font-bold">
              <button
                className={clsx("font-bold  hover:text-black dark:hover:text-white px-2 mr-3 pb-3.5 duration-300",
                  selected === "gallery"
                    ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                    : "text-neutral-400"
                )}
                onClick={() => changeSelected("gallery")}
              >
                Gallery
              </button>
            
              <button
                className={clsx("font-bold  hover:text-black dark:hover:text-white px-2 mr-3 pb-3.5 duration-300",
                  selected === "settings"
                    ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                    : "text-neutral-400"
                    )}
                onClick={() => changeSelected("settings")}
              >
                Settings
              </button>
            </div>
          </div>
          {selected === "gallery" && <EditGallery />}
          {selected === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default Edit;
