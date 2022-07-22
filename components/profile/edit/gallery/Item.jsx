import React, { useEffect, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";

export default function Item({ token, index }) {
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

  return (
    <Draggable draggableId={token.mint} index={index}>
      {(provided) => (
        <div
          className="bg-gray-100 dark:bg-dark3 my-2 p-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img
            className="w-8 h-9 inline"
            src={cdnImage(token.mint)}
            onError={(e) => addDefaultSource(e, token.mint, token.image)}
          />
          <span className="ml-2 text-sm dark:text-whitish">{token.name}</span>
        </div>
      )}
    </Draggable>
  );
}
