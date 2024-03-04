import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Icon from 'react-feather'
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
const SortableModule = ({id, children}) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,

  } = useSortable({ id: id });
  
  const isActive = active && active.id === id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}
      className={clsx("relative rounded-lg border-4",
        "border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-200 hover:dark:border-neutral-700 border-dashed",
        "duration-300 group/module",
        "cursor-default",
        active && "cursor-pointer pointer-events-none",
        isActive && "opacity-60 blur-[2px]",
      )}
    >
      <GrabHandle listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
      {children}
    </div>
  );
}

export default SortableModule;

export const GrabHandle = ({ listeners, setActivatorNodeRef, grabbing }) => (
  <button
    ref={setActivatorNodeRef} {...listeners}
    className={clsx("absolute bg-neutral-200 dark:bg-neutral-700 -left-5 w-4 top-[50%] -translate-y-[50%] py-2 rounded-l-lg duration-300 hover:scale-110 origin-right",
      grabbing ? "cursor-grabbing opacity-100" : "cursor-grab opacity-60 group-hover/module:opacity-100",
    )}
  >
    <RoundedCurve className="absolute bottom-[calc(100%-0.5rem)] h-4 -rotate-90  fill-neutral-200 dark:fill-neutral-700 bg-transparent" />
    <RoundedCurve className="absolute scale-x-[-1] top-[calc(100%-0.5rem)] h-4 -rotate-90 fill-neutral-200 dark:fill-neutral-700 bg-transparent" />
    <Icon.MoreVertical size={20} strokeWidth={2.5} className='relative right-[1px]' />
  </button>
)