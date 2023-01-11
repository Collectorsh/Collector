import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
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
import { Photo } from "./Photo";
import { SortablePhoto } from "./SortablePhoto";

import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveLayout from "/data/dashboard/saveLayout";
import { Oval } from "react-loader-spinner";
import { cdnImage } from "/utils/cdnImage";

export default function Gallery({ tokens, user }) {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState();
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const vis = tokens.filter((t) => t.visible === true);
    const hid = tokens.filter((t) => t.visible === false);
    const itemz = { visible: vis, hidden: hid };
    setItems(itemz);
  }, []);

  const doSaveLayout = async () => {
    const updatedItems = [];
    for (const [index, i] of items.visible.entries()) {
      i.order_id = index + 1;
      i.visible = true;
      updatedItems.push(i);
    }
    for (const [index, i] of items.hidden.entries()) {
      i.order_id = index + 1;
      i.visible = false;
      updatedItems.push(i);
    }
    setSaving(true);
    const res = await saveLayout(user.api_key, updatedItems);
    if (res.data.status === "success") success("Layout saved");
    else error(res.msg);
    setSaving(false);
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
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-4">
                Settings
              </h2>
              <button
                className="w-full py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                onClick={() => doSaveLayout()}
              >
                {saving ? (
                  <span className="w-fit mx-auto">
                    <Oval
                      color="#333"
                      secondaryColor="#666"
                      height={20}
                      width={20}
                    />
                  </span>
                ) : (
                  <span>Save Layout</span>
                )}
              </button>
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-6 mb-2">
                Hidden
              </h2>
              <Hidden items={items} />
            </div>
            <div className="col-span-8 col-end-13">
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-2">
                Visible
              </h2>
              <SortableContext
                id="visible"
                items={items.visible.map((i) => i.mint)}
                strategy={rectSortingStrategy}
              >
                <Grid columns={3}>
                  {items.visible.map((token, index) => (
                    <SortablePhoto
                      key={token.mint}
                      mint={token.mint}
                      uri={token.uri}
                      index={index}
                      height={250}
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
      src={cdnImage(mint)}
    />
  );
};
