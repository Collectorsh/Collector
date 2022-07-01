import React, { useState, useEffect, useCallback } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import {} from "@heroicons/react/outline";
import { HashtagIcon, EyeOffIcon } from "@heroicons/react/solid";
import { cdnImage } from "/utils/cdnImage";
import { host } from "/config/settings";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { addDefaultSource } from "/utils/addDefaultSource";

export default function Hidden({ token, setVisibility, size }) {
  const [tokenData, setTokenData] = useState();

  const initGetData = useCallback(async (tok) => {
    try {
      const res = await getMetadataFromUri(tok);
      if (res) setTokenData(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    initGetData(token);
  }, [token, initGetData]);

  function goToNft() {
    window.open(`${host}/nft/${token.mint}`, "_ blank");
  }

  return (
    <div className="flex-none relative" id={token.mint}>
      {tokenData && (
        <>
          <img
            className={`${
              size === 32 ? "w-32 h-32" : "w-48 h-48"
            } bg-black dark:bg-dark3 shadow-2xl border-t border-l border-r border-gray-200 dark:border-dark3 object-center object-cover rounded-t-lg`}
            src={cdnImage(token.mint)}
            onError={(e) => addDefaultSource(e, token.mint, token.image)}
          />
          <div className="w-full bg-black dark:bg-dark3 shadow-2xl border-l border-r border-b border-gray-200 dark:border-dark3 px-1 py-1 rounded-b-lg">
            <Tippy content="Make visible">
              <EyeOffIcon
                className="h-4 w-4 text-white cursor-pointer focus:outline-none inline"
                aria-hidden="true"
                data-tip
                data-for="show"
                onClick={(e) => setVisibility(true, token.mint)}
              />
            </Tippy>
            <button
              className="rounded bg-gray-100 px-1 py-0.5 mt-1 font-semibold text-xs cursor-pointer inline float-right"
              onClick={(e) => goToNft()}
            >
              List
            </button>
          </div>
        </>
      )}
    </div>
  );
}
