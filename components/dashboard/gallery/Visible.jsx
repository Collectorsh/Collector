import { host } from "/config/settings";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { DragSource, DropTarget } from "react-dnd";
import React, { useState, useEffect, useCallback } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import { EyeIcon } from "@heroicons/react/outline";
import { TagIcon, HashtagIcon } from "@heroicons/react/solid";
import { cdnImage } from "/utils/cdnImage";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { addDefaultSource } from "/utils/addDefaultSource";
import { gridItemImageSize } from "/utils/gridItemSize";

const Visible = forwardRef(function Visible(
  {
    token,
    setVisibility,
    setTokenAcceptOffers,
    isDragging,
    connectDragSource,
    connectDropTarget,
    size,
  },
  ref
) {
  const [acceptOffers, setAcceptOffers] = useState(token.accept_offers);
  const [tokenData, setTokenData] = useState();
  const elementRef = useRef(null);
  connectDragSource(elementRef);
  connectDropTarget(elementRef);
  const opacity = isDragging ? 0 : 1;

  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }));

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

  useEffect(() => {
    initGetData(token);
  }, [acceptOffers]);

  function updateAcceptOffers() {
    let accepting = acceptOffers ? false : true;
    setAcceptOffers(accepting);
    setTokenAcceptOffers(token.mint, accepting);
  }

  function goToNft() {
    window.open(`${host}/nft/${token.mint}`, "_ blank");
  }

  return (
    <div className="flex-none" ref={elementRef} id={token.mint}>
      {tokenData && (
        <>
          <img
            className={`${gridItemImageSize(
              size
            )} bg-black dark:bg-dark3 shadow-2xl dark:bg-dark3 object-center object-cover rounded-t-lg h-48 cursor-move border-t border-l border-r border-gray-200 dark:border-dark3`}
            src={cdnImage(token.mint)}
            onError={(e) => addDefaultSource(e, token.mint, token.image)}
          />
          <div className="w-full bg-black dark:bg-dark3 shadow-2xl dark:bg-dark3 px-1 py-1 rounded-b-lg align-middle border-l border-r border-b border-gray-200 dark:border-dark3">
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
});

export default DropTarget(
  "visible",
  {
    hover(props, monitor, component) {
      if (!component) {
        return null;
      }
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) {
        return null;
      }
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    "visible",
    {
      beginDrag: (props) => ({
        id: props.id,
        index: props.index,
      }),
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(Visible)
);
