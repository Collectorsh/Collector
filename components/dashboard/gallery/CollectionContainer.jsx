import React, { useState, useEffect } from "react";
import { success, error } from "/utils/toast";
import update from "immutability-helper";
import saveLayout from "/data/dashboard/saveLayout";
import cloneDeep from "lodash/cloneDeep";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function CollectionContainer({ tkns, user }) {
  const initialColumns = {
    visible: {
      id: "visible",
      list: tkns.filter((t) => t.visible === true),
    },
    hidden: {
      id: "hidden",
      list: tkns.filter((t) => t.visible === false),
    },
  };
  const [columns, setColumns] = useState(initialColumns);

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

  return (
    <div className="dark:bg-black min-h-screen pb-12 mt-16">
      <div className="mb-12">
        <h2 className="text-5xl font-extrabold text-black w-fit py-1 inline-block dark:text-whitish">
          Edit Gallery
        </h2>
        <p className="dark:text-white">Drag and drop to curate your gallery.</p>
      </div>

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
            <Column col={col} key={col.id} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
