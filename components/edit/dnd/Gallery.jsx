import React, { useState, useEffect } from "react";
import axios from "axios";
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

import cloneDeep from "lodash/cloneDeep";
import { Toaster } from "react-hot-toast";
import { cdnImage } from "/utils/cdnImage";
import LazyLoader from "../../LazyLoader";

export default function Gallery({ tokens, user }) {
  const [activeId, setActiveId] = useState(null);
  const [columns, setColumns] = useState(user.columns);
  const [items, setItems] = useState();
  const [bulkEdit, setBulkEdit] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const vis = tokens.filter((t) => t.visible === true);
    const hid = tokens.filter((t) => t.visible === false);
    const itemz = { visible: vis, hidden: hid };
    setItems(itemz);
  }, []);

  const hideSelected = () => {
    const clonedItems = cloneDeep(items);
    const newItems = { visible: [], hidden: clonedItems.hidden };
    for (const [index, i] of clonedItems.visible.entries()) {
      const id = `select-${i.mint}`;
      const checked = document.getElementById(id).checked;
      if (checked === true) {
        newItems.hidden.push(i);
      } else {
        newItems.visible.push(i);
      }
    }
    setItems(newItems);
  };

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
        if (active.data.current.sortable.containerId === "hidden") return;
        setItems((items) => {
          const activeIndex = active.data.current.sortable.index;
          let newItems;
          newItems = moveToHidden(items, active.id, activeIndex);
          return newItems;
        });
      } else if (over.id === "show") {
        if (active.data.current.sortable.containerId === "visible") return;
        setItems((items) => {
          const activeIndex = active.data.current.sortable.index;
          let newItems;
          newItems = moveToVisible(items, active.id, activeIndex);
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

  const moveToVisible = (items, item, activeIndex) => {
    const itm = items.hidden.filter((t) => t.mint === item)[0];
    return {
      ...items,
      hidden: removeAtIndex(items.hidden, activeIndex),
      visible: insertAtIndex(items.visible, items.visible.length, itm),
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
          <div className="grid grid-cols-1 sm:grid-cols-12">
            <div className="col-span-1 sm:col-span-3">
              <Settings
                items={items}
                user={user}
                columns={columns}
                setColumns={setColumns}
                hideAll={hideAll}
                showAll={showAll}
              />
              <div className="hidden sm:block">
                <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-2 mb-2">
                  Hidden
                </h2>
                <Hidden items={items} />
              </div>
            </div>
            <div className="col-span-1 sm:col-span-8 sm:col-end-13">
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-2">
                <div className="grid grid-cols-3">
                  <div className="col-span-1 text-left">
                    <input
                      type="checkbox"
                      name="bulkedit"
                      className="w-6 h-6 border-gray-200 cursor-pointer m-0 align-middle -mt-0.5"
                      style={{ accentColor: "#31f292" }}
                      onClick={() => setBulkEdit(!bulkEdit)}
                    />
                    {bulkEdit ? (
                      <button
                        className="ml-2 rounded-2xl bg-gray-300 hover:bg-gray-200 dark:bg-dark1 hover:dark:bg-black text-black dark:text-white px-4 py-1.5 -mt-0.5 align-middle text-sm font-bold"
                        onClick={() => hideSelected()}
                      >
                        <span>Hide Selected</span>
                      </button>
                    ) : (
                      <span className="ml-2 align middle text-xs">
                        Select All
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 text-center">Visible</div>
                  <div className="col-span-1 text-right">
                    <span className="rounded-2xl bg-gray-300 dark:bg-black text-white px-4 py-1 -mt-1 align-middle">
                      {items.visible.length}
                    </span>
                  </div>
                </div>
              </h2>
              <Visible items={items} columns={columns} bulkEdit={bulkEdit} />
            </div>
          </div>
        )}
        <DragOverlay adjustScale={false}>
          {activeId ? <OverlayImage mint={activeId} tokens={tokens} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

const Visible = ({ items, columns, bulkEdit }) => {
  const { setNodeRef } = useDroppable({ id: "show" });
  const [lazyLoadIndex, setLazyLoadIndex] = useState(9);
  const renderedItems = items.visible//.slice(0, lazyLoadIndex)
  const handleLazyLoad = () => {
    setLazyLoadIndex(prev => prev + 9);
  }
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-dark2 sm:overflow-x-scroll h-full sm:h-[86vh]"
    >
      <SortableContext
        id="visible"
        items={renderedItems.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={columns}>
          {renderedItems.map((token, index) => (
            <SortablePhoto
              key={token.mint}
              mint={token.mint}
              uri={token.uri}
              index={index}
              height={
                columns === 2
                  ? 350
                  : columns === 3
                  ? 250
                  : columns === 4
                  ? 200
                  : 150
              }
              section="visible"
              bulkEdit={bulkEdit}
            />
          ))}
        </Grid>
      </SortableContext>
      {/* {(lazyLoadIndex < items.hidden.length) ? <LazyLoader cb={handleLazyLoad} /> : null} */}
    </div>
  );
};

const Hidden = ({ items }) => {
  const { setNodeRef } = useDroppable({ id: "hide" });
  const [lazyLoadIndex, setLazyLoadIndex] = useState(9);
  const renderedItems = items.hidden//.slice(0, lazyLoadIndex)
  const handleLazyLoad = () => {
    setLazyLoadIndex(prev => prev + 9);
  }

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-dark2 overflow-x-scroll h-[50vh]"
    >
      <SortableContext
        id="hidden"
        items={renderedItems.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={2}>
          {renderedItems.map((token, index) => (
            <SortablePhoto
              key={token.mint}
              mint={token.mint}
              uri={token.uri}
              index={index}
              height={150}
              section="hidden"
            />
          ))}
        </Grid>
      </SortableContext>
      {/* {(lazyLoadIndex < items.hidden.length) ? <LazyLoader cb={handleLazyLoad} /> : null} */}
    </div>
  );
};

const OverlayImage = ({ mint, tokens }) => {
  const addDefaultImage = async (e, mint, tokens) => {
    e.target.style.background = "grey";
    const token = tokens.find((t) => t.mint === mint);
    let res = await axios.get(token.uri);
    e.target.src = res.data.image;
  };

  return (
    <img
      src={cdnImage(mint)}
      className="w-[150px] h-[150px] w-full cursor-pointer hover:origin-center object-center object-cover shadow-sm"
      onError={(e) => addDefaultImage(e, mint, tokens)}
    />
  );
};
