import React, { useState, useEffect, useCallback } from "react";
import getMetadata from "/data/nft/getMetadata";
import { DragDropContext } from "react-beautiful-dnd";
import saveLayout from "/data/dashboard/saveLayout";
import { Oval } from "react-loader-spinner";
import Column from "./Column";

export default function EditGallery({ user }) {
  const [columns, setColumns] = useState();

  const getTokens = useCallback(async (user) => {
    let tokens = await getMetadata(user.public_keys);
    const initialColumns = {
      visible: {
        id: "visible",
        list: tokens.filter((t) => t.visible === true),
      },
      hidden: {
        id: "hidden",
        list: tokens.filter((t) => t.visible === false),
      },
    };
    setColumns(initialColumns);
  }, []);

  useEffect(() => {
    getTokens(user);
  }, []);

  // Save the layout any time it changes
  useEffect(() => {
    if (!columns) return;
    let tokens = [];
    let count = 1;
    columns.visible.list.map((t) => {
      tokens.push({
        mint: t.mint,
        visible: true,
        order_id: count,
        accept_offers: t.accept_offers,
      });
      count += 1;
    });
    columns.hidden.list.map((t) => {
      tokens.push({
        mint: t.mint,
        visible: false,
        order_id: count,
        accept_offers: t.accept_offers,
      });
      count += 1;
    });
    saveLayout(user.api_key, tokens);
  }, [columns]);

  function onDragEnd({ source, destination }) {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // If the source and destination columns are the same
    // AND if the index is the same, the item isn't moving
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = Array.from(start.list);
      const [reorderedList] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, reorderedList);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = Array.from(start.list);
      newStartList.splice(source.index, 1);

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  }

  function setTokenAcceptOffers(token, accepting) {
    const id = token.visible ? "visible" : "hidden";
    const newList = Array.from(columns[id].list);
    newList[token.order_id - 1].accept_offers = accepting;

    // Then create a new copy of the column object
    const newCol = {
      id: id,
      list: newList,
    };

    // Update the state
    setColumns((state) => ({ ...state, [id]: newCol }));
  }

  return (
    <div className="dark:bg-black min-h-screen pb-12 mt-8 lg:mt-16">
      <div className="mb-12">
        <p className="dark:text-white">Drag and drop to curate your gallery.</p>
      </div>

      {columns ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              margin: "24px auto",
              width: "100%",
              gap: "50px",
            }}
          >
            <div>
              <h2 className="border-b border-b-black dark:border-b-white align-middle text-3xl font-extrabold text-black w-fit py-1 inline-block dark:text-whitish">
                Visible
              </h2>
            </div>
            <div>
              <h2 className="border-b border-b-black dark:border-b-white align-middle text-3xl font-extrabold text-black w-fit py-1 inline-block dark:text-whitish">
                Hidden
              </h2>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              margin: "24px auto",
              width: "100%",
              gap: "50px",
            }}
          >
            {Object.values(columns).map((col) => (
              <Column
                col={col}
                key={col.id}
                setTokenAcceptOffers={setTokenAcceptOffers}
              />
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="mt-4 w-[50px] mx-auto h-64">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
    </div>
  );
}
