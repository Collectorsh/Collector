import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { Grid } from "./Grid";
import { SortablePhoto } from "./SortablePhoto";
import { Photo } from "./Photo";

import saveLayout from "/data/dashboard/saveLayout";

export default function Gallery({ tokens, user }) {
  const [items, setItems] = useState(tokens);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    for (const [index, i] of items.entries()) {
      i.order_id = index + 1;
    }
    saveLayout(user.api_key, items);
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={3}>
          {items.map((token, index) => (
            <SortablePhoto
              key={token.mint}
              mint={token.mint}
              uri={token.uri}
              index={index}
            />
          ))}
        </Grid>
      </SortableContext>

      <DragOverlay adjustScale={true}>
        {activeId ? (
          <Photo
            mint={activeId}
            uri={items.filter((i) => i.mint === activeId)[0].uri}
            index={items.map((i) => i.mint).indexOf(activeId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event) {
    console.log("start");
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.map((i) => i.mint).indexOf(active.id);
        const newIndex = items.map((i) => i.mint).indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    console.log("cancel");
    setActiveId(null);
  }
}
