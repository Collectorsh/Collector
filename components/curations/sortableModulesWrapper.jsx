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
import { Module } from './displayModules';
import { GrabHandle } from './sortableModule';
const SortableModulesWrapper = ({ moduleComponents, modules, setModules, className, submittedTokens, approvedArtists }) => {
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
      setModules((modules) => {
        const oldIndex = modules.findIndex(module => module.id === active.id);
        const newIndex = modules.findIndex(module => module.id === over.id);

        if (oldIndex < 0 || newIndex < 0) return modules;

        return arrayMove(modules, oldIndex, newIndex);
      });
    }
  }
  const renderItem = (id) => { 
    const module = modules.find(module => module.id === id);
    if (!module) return null
    return (
      <div className="relative rounded-lg ring-4 ring-neutral-200 dark:ring-neutral-700 cursor-grabbing palette1 w-full scale-50 origin-left">
        <GrabHandle grabbing/>
        <div className='pointer-events-none w-full'>
          <Module
            module={module} 
            submittedTokens={submittedTokens}
            approvedArtists={approvedArtists}
          />
        </div>
      </div>
    )
  }
  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modules?.map(module => module.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>
            {moduleComponents}
        </div>
      </SortableContext>
      <DragOverlay modifiers={[restrictToParentElement]}>
        {activeId ? renderItem(activeId) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableModulesWrapper;