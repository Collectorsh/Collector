import React, { useState } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import Mint from "/components/mint_tools/Mint";
import Created from "/components/mint_tools/Created";

function MintTools() {
  const [selected, setSelected] = useState("mint");

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  return (
    <div className="dark:bg-black dark:text-whitish">
      {/* <CheckLoggedIn require_holder={true} /> */}
      <MainNavigation />
      <div className="max-w-7xl mx-auto relative">
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Mint Tools
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <ul className="font-bold">
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mr-3 pb-3.5 ${
                    selected === "mint" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("mint")}
                >
                  Mint
                </li>
                <li
                  className={`cursor-pointer hover:text-greeny inline px-2 mx-3 pb-3.5 ${
                    selected === "created" &&
                    "text-greeny font-extrabold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => changeSelected("created")}
                >
                  Created
                </li>
              </ul>
            </div>
            {selected === "mint" && <Mint />}
            {selected === "created" && <Created />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintTools;
