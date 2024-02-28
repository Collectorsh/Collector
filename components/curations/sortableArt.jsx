import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
import * as Icon from 'react-feather'
const SortableArt = ({ id, children }) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,

  } = useSortable({ id: id });

  const isActive = active && active?.id === id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}
      {...listeners}
      className={clsx("relative inline",
        "",
        active && "pointer-events-none",
        isActive ? "opacity-50 blur-[2px] cursor-grabbing" : "cursor-grab",
      )}
    >
      <ArtGrabHandle grabbing={isActive} />
      {children}

    </div>
  );
}

export default SortableArt;

export const ArtGrabHandle = ({ grabbing }) => (
  <button
    className={clsx("absolute bg-neutral-300 dark:bg-neutral-700 -left-4 w-4 top-[50%] -translate-y-[50%] py-2 rounded-l-lg duration-200 hover:scale-110 origin-right",
      grabbing ? "cursor-grabbing " : "cursor-grab",
    )}
  >
    <RoundedCurve className="absolute bottom-[calc(100%-0.5rem)] h-4 -rotate-90  fill-neutral-300 dark:fill-neutral-700 bg-transparent" />
    <RoundedCurve className="absolute scale-x-[-1] top-[calc(100%-0.5rem)] h-4 -rotate-90 fill-neutral-300 dark:fill-neutral-700 bg-transparent" />
    <Icon.MoreVertical size={20} strokeWidth={2.5} className='relative right-0.5'/>
  </button>
)