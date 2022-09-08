import React, { useState, useEffect, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import { cdnImage } from "/utils/cdnImage";
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
    setTokenAcceptOffers(token, accepting);
  }

  function goToNft() {
    window.open(`/nft/${token.mint}`, "_ blank");
  }

  function addDefaultSource(e, url) {
    if (!url) return;
    e.target.src = url;
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
          <div className="col-span-9">
            <img
              className="w-8 h-9 inline"
              src={cdnImage(token.mint)}
              onError={(e) => addDefaultSource(e, token.image)}
            />
            <span className="ml-2 text-sm dark:text-whitish">{token.name}</span>
          </div>
          <div className="col-span-3">
            <div className="float-right">
              <Tippy content="Tag as Accepting Offers">
                <TagIcon
                  className={`h-4 w-4 cursor-pointer inline focus:outline-none ${
                    acceptOffers ? "text-green-700" : "text-gray-300"
                  }`}
                  aria-hidden="true"
                  onClick={() => updateAcceptOffers()}
                />
              </Tippy>
              <button
                className="rounded bg-gray-300 px-1 py-0.5 mt-1 font-semibold text-black text-xs cursor-pointer inline ml-2"
                onClick={() => goToNft()}
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
