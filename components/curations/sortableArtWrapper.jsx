import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToHorizontalAxis
} from '@dnd-kit/modifiers';
import { useState } from 'react';
import { GrabHandle } from './sortableModule';

const SortableArtWrapper = ({ children, artModule, setArtModule, className }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState(null);

  function handleDragStart({ active, over }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (active.id !== over.id) {
      setArtModule((module) => {
        const tokens = module.tokens;
        const oldIndex = tokens.findIndex(tokenMint => tokenMint === active.id);
        const newIndex = tokens.findIndex(tokenMint => tokenMint === over.id);

        const newTokens = arrayMove(tokens, oldIndex, newIndex);
        return {
          ...module,
          tokens: newTokens
        }
      });
    }
  }
  // const renderItem = (id) => {
  //   const module = modules.find(module => module.id === id);
  //   if (!module) return null
  //   return (
  //     <div className="relative rounded-lg ring-4 ring-neutral-200 dark:ring-neutral-700 cursor-grabbing bg-white dark:bg-black w-full">
  //       <GrabHandle grabbing />
  //       <div className='pointer-events-none w-full'>
  //         <Module
  //           module={module}
  //           submittedTokens={submittedTokens}
  //           approvedArtists={approvedArtists}
  //         />
  //       </div>
  //     </div>
  //   )
  // }
  return (
    <DndContext
      modifiers={[restrictToParentElement]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={artModule.tokens}
        // strategy={horizontalListSortingStrategy}
      >
        {/* <div className={className}> */}
          {children}
        {/* </div> */}
      </SortableContext>
      {/* <DragOverlay modifiers={[restrictToParentElement]}>
        {activeId ? renderItem(activeId) : null}
      </DragOverlay> */}
    </DndContext>
  );
}

export default SortableArtWrapper;