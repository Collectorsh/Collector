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
import { useMemo, useState } from 'react';
import { GrabHandle } from './sortableModule';
import { ArtGrabHandle } from './sortableArt';

const SortableArtWrapper = ({ children, artModule, setArtModule, itemsInModule }) => {
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

  const overlay = useMemo(() => {
    if (!activeId) return null;
    return (
      <div className='cursor-grabbing'>
        {/* <ArtGrabHandle grabbing /> */}
        <div className='pointer-events-none'>
          {itemsInModule.find(element => element.key === activeId)}
        </div>
      </div>
    )
  }, [activeId, itemsInModule])

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
       
        {children}

      </SortableContext>
      <DragOverlay modifiers={[restrictToParentElement]}>
        {overlay}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableArtWrapper;