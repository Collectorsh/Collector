import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Photo } from "./Photo";

export const SortablePhoto = (props) => {
  const sortable = useSortable({ id: props.token.mint });
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Photo
      ref={setNodeRef}
      style={style}
      section={props.section}
      bulkEdit={props.bulkEdit}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};
