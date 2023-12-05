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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useState } from 'react';
import { GrabHandle } from './sortableModule';
import { CurationListItem } from '../curatorProfile/curationList';

const SortableCurationPreviewWrapper = ({ children, curations, setCurations, className }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState(null);

  function handleDragStart({ active, over }) {
    setActiveId(active.id);
  }

  function handleDragEnd({active,over }) {
    setActiveId(null);

    if (active.id !== over.id) {
      setCurations((curations) => {
        const oldIndex = curations.findIndex(curation => curation.id === active.id);
        const newIndex = curations.findIndex(curation => curation.id === over.id);

        if (oldIndex < 0 || newIndex < 0) return curations;

        return arrayMove(curations, oldIndex, newIndex);
      });
    }
  }
  const renderItem = (id) => { 
    const curation = curations.find(curation => curation.id === id)
    if(!curation) return null
    return (
      <div className="relative rounded-lg ring-4 ring-neutral-200 dark:ring-neutral-700 cursor-grabbing bg-white dark:bg-black w-full">
        <GrabHandle grabbing/>
        <div className='pointer-events-none w-full'>
          <CurationListItem curation={curation} isOwner/>
        </div>
      </div>
    )
  }
  return (
    <DndContext
      // modifiers={[restrictToParentElement]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={curations.map(curation => curation.id)}
        // strategy={verticalListSortingStrategy}
      >
        <div className={className}>
            {children}
        </div>
      </SortableContext>
      <DragOverlay
        // modifiers={[restrictToParentElement]}
      >
        {activeId ? renderItem(activeId) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableCurationPreviewWrapper;