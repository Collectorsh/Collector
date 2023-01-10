import React, { useState, useEffect } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";
import { Grid } from "./Grid";
import { SortablePhoto } from "./SortablePhoto";

import saveLayout from "/data/dashboard/saveLayout";

export default function Gallery({ tokens, user }) {
  const [items, setItems] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!items) return;
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
    saveLayout(user.api_key, updatedItems);
  }, [items]);

  useEffect(() => {
    const vis = tokens.filter((t) => t.visible === true);
    const hid = tokens.filter((t) => t.visible === false);
    const itemz = { visible: vis, hidden: hid };
    setItems(itemz);
  }, []);

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
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
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

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {items && (
        <div className="grid grid-cols-12">
          <div className="col-span-3 h-full">
            <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-2">
              Hidden
            </h2>
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
                  />
                ))}
              </Grid>
            </SortableContext>
          </div>
          <div className="col-span-7 col-end-13">
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
                  />
                ))}
              </Grid>
            </SortableContext>

            {/* <DragOverlay adjustScale={true}>
              {activeId ? (
                <Photo
                  mint={activeId}
                  uri={items.visible.filter((i) => i.mint === activeId)[0].uri}
                  index={items.visible.map((i) => i.mint).indexOf(activeId)}
                />
              ) : null}
            </DragOverlay> */}
          </div>
        </div>
      )}
    </DndContext>
  );
}
