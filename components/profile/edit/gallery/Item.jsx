import React, { useState, useEffect, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";
import { TagIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function Item({ token, index, setTokenAcceptOffers }) {
  const [acceptOffers, setAcceptOffers] = useState(token.accept_offers);

  const initGetData = useCallback(async (tok) => {
    try {
      await getMetadataFromUri(tok);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    initGetData(token);
  }, [token, initGetData]);

  function updateAcceptOffers() {
    let accepting = acceptOffers ? false : true;
    setAcceptOffers(accepting);
    setTokenAcceptOffers(token.mint, accepting);
  }

  function goToNft() {
    window.open(`${host}/nft/${token.mint}`, "_ blank");
  }

  return (
    <Draggable draggableId={token.mint} index={index}>
      {(provided) => (
        <div
          className="bg-gray-100 dark:bg-dark3 my-2 p-2 grid grid-cols-12"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="col-span-10">
            <img
              className="w-8 h-9 inline"
              src={cdnImage(token.mint)}
              onError={(e) => addDefaultSource(e, token.mint, token.image)}
            />
            <span className="ml-2 text-sm dark:text-whitish">{token.name}</span>
          </div>
          <div className="col-span-2">
            <div className="absolute bottom-0 w-full bg-black dark:bg-dark3 dark:bg-dark3 px-1 py-1 rounded-b-lg align-middle">
              <Tippy content="Make not visible" className="bg-gray-300">
                <EyeIcon
                  className="h-5 w-5 text-white cursor-pointer inline focus:outline-none"
                  aria-hidden="true"
                  onClick={(e) => setVisibility(false, token.mint)}
                />
              </Tippy>
              <Tippy content="Tag as Accepting Offers">
                <TagIcon
                  className={`h-4 w-4 cursor-pointer inline focus:outline-none ml-2 ${
                    acceptOffers ? "text-green-700" : "text-white"
                  }`}
                  aria-hidden="true"
                  onClick={(e) => updateAcceptOffers()}
                />
              </Tippy>
              <button
                className="rounded bg-gray-100 px-1 py-0.5 mt-1 font-semibold text-black text-xs cursor-pointer inline float-right"
                onClick={(e) => goToNft()}
              >
                List
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
