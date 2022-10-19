import React, { useContext } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import Galleries from "/components/galleries/Galleries";

export default function GalleriesHome() {
  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="border-b border-gray-200 dark:border-dark3 pb-20 tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Galleries
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <Galleries />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
