import React, { useState, useEffect } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";
import { Grid } from "./Grid";
import { SortablePhoto } from "./SortablePhoto";
import Settings from "./Settings";

import { Toaster } from "react-hot-toast";
import { cdnImage } from "/utils/cdnImage";
import cloneDeep from "lodash/cloneDeep";

export default function Gallery({ tokens, user }) {
  const [activeId, setActiveId] = useState(null);
  const [columns, setColumns] = useState(user.columns);
  const [items, setItems] = useState();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const vis = tokens.filter((t) => t.visible === true);
    const hid = tokens.filter((t) => t.visible === false);
    const itemz = { visible: vis, hidden: hid };
    setItems(itemz);
  }, []);

  const hideAll = () => {
    const clonedItems = cloneDeep(items);
    for (const [index, i] of clonedItems.visible.entries()) {
      clonedItems.hidden.push(i);
    }
    clonedItems.visible = [];
    setItems(clonedItems);
  };

  const showAll = () => {
    const clonedItems = cloneDeep(items);
    for (const [index, i] of clonedItems.hidden.entries()) {
      clonedItems.visible.push(i);
    }
    clonedItems.hidden = [];
    setItems(clonedItems);
  };

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        const res = moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
        return res;
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      if (over.id === "hide") {
        console.log(active);
        if (active.data.current.sortable.containerId === "hidden") return;
        setItems((items) => {
          const activeIndex = active.data.current.sortable.index;
          let newItems;
          newItems = moveToHidden(items, active.id, activeIndex);
          return newItems;
        });
      } else {
        const activeContainer = active.data.current.sortable.containerId;
        const overContainer =
          over.data.current?.sortable.containerId || over.id;
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;
        setItems((items) => {
          let newItems;
          if (activeContainer === overContainer) {
            newItems = {
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex
              ),
            };
          } else {
            newItems = moveBetweenContainers(
              items,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active.id
            );
          }
          return newItems;
        });
      }
    }
    setActiveId(null);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    const itm = items[activeContainer].filter((t) => t.mint === item)[0];
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, itm),
    };
  };

  const moveToHidden = (items, item, activeIndex) => {
    const itm = items.visible.filter((t) => t.mint === item)[0];
    return {
      ...items,
      visible: removeAtIndex(items.visible, activeIndex),
      hidden: insertAtIndex(items.hidden, items.hidden.length, itm),
    };
  };

  return (
    <>
      <Toaster />
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        {items && (
          <div className="grid grid-cols-12">
            <div className="col-span-3 h-full">
              <Settings
                items={items}
                user={user}
                columns={columns}
                hideAll={hideAll}
                showAll={showAll}
              />
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-6 mb-2">
                Hidden
              </h2>
              <Hidden items={items} />
            </div>
            <div className="col-span-8 col-end-13">
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-2">
                <div className="grid grid-cols-3">
                  <div className="col-span-1 text-left">
                    <span
                      className={`rounded-2xl text-white px-4 py-1 -mt-1 align-middle ${
                        columns === 3
                          ? "bg-black dark:bg-white dark:text-black"
                          : "bg-gray-300 dark:bg-black cursor-pointer"
                      }`}
                      onClick={() => setColumns(3)}
                    >
                      3
                    </span>
                    <span
                      className={`ml-1 rounded-2xl text-white px-4 py-1 -mt-1 align-middle ${
                        columns === 4
                          ? "bg-black dark:bg-white dark:text-black"
                          : "bg-gray-300 dark:bg-black cursor-pointer"
                      }`}
                      onClick={() => setColumns(4)}
                    >
                      4
                    </span>
                    <span
                      className={`ml-1 rounded-2xl text-white px-4 py-1 -mt-1 align-middle ${
                        columns === 5
                          ? "bg-black dark:bg-white dark:text-black"
                          : "bg-gray-300 dark:bg-black cursor-pointer"
                      }`}
                      onClick={() => setColumns(5)}
                    >
                      5
                    </span>
                  </div>
                  <div className="col-span-1 text-center">Visible</div>
                  <div className="col-span-1 text-right">
                    <span className="rounded-2xl bg-gray-300 dark:bg-black text-white px-4 py-1 -mt-1 align-middle">
                      {items.visible.length}
                    </span>
                  </div>
                </div>
              </h2>
              <SortableContext
                id="visible"
                items={items.visible.map((i) => i.mint)}
                strategy={rectSortingStrategy}
              >
                <Grid columns={columns}>
                  {items.visible.map((token, index) => (
                    <SortablePhoto
                      key={token.mint}
                      mint={token.mint}
                      uri={token.uri}
                      index={index}
                      height={columns === 3 ? 250 : columns === 4 ? 200 : 150}
                    />
                  ))}
                </Grid>
              </SortableContext>
            </div>
          </div>
        )}
        <DragOverlay adjustScale={false}>
          {activeId ? <OverlayImage mint={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

const Hidden = ({ items }) => {
  const { setNodeRef } = useDroppable({ id: "hide" });

  return (
    <div ref={setNodeRef} className="h-full bg-gray-100 dark:bg-dark2">
      <SortableContext
        id="hidden"
        items={items.hidden.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={2}>
          {items.hidden.map((token, index) => (
            <SortablePhoto
              key={token.mint}
              mint={token.mint}
              uri={token.uri}
              index={index}
              height={150}
            />
          ))}
        </Grid>
      </SortableContext>
    </div>
  );
};

const OverlayImage = ({ mint }) => {
  return (
    <img
      className="w-[150px] h-[150px] w-full cursor-pointer hover:origin-center object-center object-cover shadow-sm"
      style={{
        backgroundImage: `url("${cdnImage(mint)}")`,
        backgroundSize: "cover",
      }}
      // src={cdnImage(mint)}
    />
  );
};
