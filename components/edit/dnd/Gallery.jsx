import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  DndContext,
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
import { SortablePhoto } from "./SortablePhoto";
import Settings from "./Settings";

import cloneDeep from "lodash/cloneDeep";
import { Toaster } from "react-hot-toast";
import { cdnImage } from "/utils/cdnImage";
import LazyLoader from "../../LazyLoader";
import CloudinaryImage from "../../CloudinaryImage";
import { useImageFallbackContext } from "../../../contexts/imageFallback";
import OptimizeFeedbackModal from "./OptimizeFeedbackModal";

import { Grid as VirtualGrid, AutoSizer } from 'react-virtualized';

export default function Gallery({ tokens, user }) {
  const [activeId, setActiveId] = useState(null);
  const [columns, setColumns] = useState(user?.columns);
  const [items, setItems] = useState();
  const [bulkEdit, setBulkEdit] = useState(false);
  const { waiting, completed, uploadAll, uploadAllCompleted, cloudinaryCompleted } = useImageFallbackContext()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  
  useEffect(() => {    
    if (!waiting) {
      uploadAll(tokens)//will optimized any images not optimized yet
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, waiting])
  
  useEffect(() => {
    const optimizedTokens = tokens.filter((t) => t.optimized === "True" || cloudinaryCompleted.some(cc => cc.mint === t.mint))
    const tokenClone = cloneDeep(optimizedTokens);
    const vis = tokenClone.filter((t) => t.visible === true);
    const hid = tokenClone.filter((t) => t.visible === false);
    const itemz = { visible: vis, hidden: hid };
    setItems(itemz);
  }, [tokens, cloudinaryCompleted]);

  const progress = ((completed) / waiting) * 100
  const showProgress = Boolean(waiting && waiting > completed) && !uploadAllCompleted

  useEffect(() => {
    if(showProgress) setFeedbackOpen(true)
    else setFeedbackOpen(false)
  },[showProgress])
  
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));


  const hideSelected = () => {
    const clonedItems = cloneDeep(items);
    const newItems = { visible: [], hidden: clonedItems.hidden };
    for (const [index, i] of clonedItems.visible.entries()) {
      const id = `select-${i.mint}`;
      const checked = document.getElementById(id).checked;
      if (checked === true) {
        newItems.hidden.push(i);
      } else {
        newItems.visible.push(i);
      }
    }
    setItems(newItems);
  };

  const hideAll = () => {
    const clonedItems = cloneDeep(items);
    for (const [index, i] of clonedItems.visible.entries()) {
      clonedItems.hidden.push(i);
    }
    clonedItems.visible = [];
    setItems(clonedItems);
  };

  const showAll = () => {
    const clonedItems = cloneDeep(items);
    for (const [index, i] of clonedItems.hidden.entries()) {
      clonedItems.visible.push(i);
    }
    clonedItems.hidden = [];
    setItems(clonedItems);
  };

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable?.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((prev) => {
        const itemsClone = cloneDeep(prev);
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        const res = moveBetweenContainers(
          itemsClone,
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
        if (active.data.current.sortable.containerId === "hidden") return;
        setItems((prev) => {
          const itemsClone = cloneDeep(prev);
          const activeIndex = active.data.current.sortable.index;
  
          const newItems = moveToHidden(itemsClone, active.id, activeIndex);
          return newItems;
        });
      } else if (over.id === "show") {
        if (active.data.current.sortable.containerId === "visible") return;
        setItems((prev) => {
          const itemsClone = cloneDeep(prev);
          const activeIndex = active.data.current.sortable.index;
          const newItems = moveToVisible(itemsClone, active.id, activeIndex);
          return newItems;
        });
      } else {
        const activeContainer = active.data.current.sortable.containerId;
        const overContainer =
          over.data.current?.sortable.containerId || over.id;
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;
        setItems((prev) => {
          const itemsClone = cloneDeep(prev);
          let newItems;
          if (activeContainer === overContainer) {
            newItems = {
              ...itemsClone,
              [overContainer]: arrayMove(
                itemsClone[overContainer],
                activeIndex,
                overIndex
              ),
            };
          } else {
            newItems = moveBetweenContainers(
              itemsClone,
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
    prevItems,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    const newItems = cloneDeep(prevItems);
    const itm = newItems[activeContainer].filter((t) => t.mint === item)[0];
    return {
      ...newItems,
      [activeContainer]: removeAtIndex(newItems[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(newItems[overContainer], overIndex, itm),
    };
  };

  const moveToHidden = (prevItems, item, activeIndex) => {
    const newItems = cloneDeep(prevItems);
    const itm = newItems.visible.filter((t) => t.mint === item)[0];
    return {
      ...newItems,
      visible: removeAtIndex(newItems.visible, activeIndex),
      hidden: insertAtIndex(newItems.hidden, newItems.hidden.length, itm),
    };
  };

  const moveToVisible = (prevItems, item, activeIndex) => {
    const newItems = cloneDeep(prevItems);
    const itm = newItems.hidden.filter((t) => t.mint === item)[0];
    return {
      ...newItems,
      hidden: removeAtIndex(newItems.hidden, activeIndex),
      visible: insertAtIndex(newItems.visible, newItems.visible.length, itm),
    };
  };

  const overlay = useMemo(() => {
    if (!activeId) return null;
    return <OverlayImage mint={activeId} tokens={tokens} />
  }, [activeId, tokens])

  return (
    <>
      <Toaster />
      <OptimizeFeedbackModal isOpen={feedbackOpen} setIsOpen={setFeedbackOpen} waiting={waiting} completed={completed} progress={progress} />
 
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        {items && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-1 sm:col-span-3">
              <Settings
                items={items}
                user={user}
                columns={columns}
                setColumns={setColumns}
                hideAll={hideAll}
                showAll={showAll}
              />
              <div className="hidden sm:block">
                <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-2 mb-2">
                  Hidden
                </h2>
                <Hidden items={items} />
              </div>
            </div>
            <div className="col-span-1 sm:col-span-9">
              <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-2 relative">

                {(showProgress) ? (
                  <div className="absolute w-full h-full bg-gray-100 dark:bg-dark3 rounded top-0 left-0 flex items-center px-4 gap-4">
                    <p className="flex-shrink-0">Optimizing Images: <span>({completed}/{waiting})</span></p>
                    <div className="border-2 border-black dark:border-white rounded-full w-full h-3 relative" >
                      <div
                        style={{ width: `${ progress }%` }}
                        className="bg-black dark:bg-white rounded-full h-2 w-0 absolute inset-0 animate-pulse"
                      />
                    </div>
                  </div>
                  ) : null
                }

                <div className="grid grid-cols-3">
                  <div className="col-span-1 text-left">
                    <input
                      type="checkbox"
                      name="bulkedit"
                      className="w-6 h-6 border-gray-200 cursor-pointer m-0 align-middle -mt-0.5"
                      style={{ accentColor: "#31f292" }}
                      onClick={() => setBulkEdit(!bulkEdit)}
                    />
                    {bulkEdit ? (
                      <button
                        className="ml-2 rounded-2xl bg-gray-300 hover:bg-gray-200 dark:bg-dark1 hover:dark:bg-black text-black dark:text-white px-4 py-1.5 -mt-0.5 align-middle text-sm font-bold"
                        onClick={() => hideSelected()}
                      >
                        <span>Hide Selected</span>
                      </button>
                    ) : (
                      <span className="ml-2 align middle text-xs">
                        Select All
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 text-center">Visible</div>
                  <div className="col-span-1 text-right">
                    <span className="rounded-2xl bg-gray-300 dark:bg-black text-white px-4 py-1 -mt-1 align-middle">
                      {items.visible.length}
                    </span>
                  </div>
                </div>
              </h2>
              <Visible items={items} columns={columns} bulkEdit={bulkEdit} />
            </div>
          </div>
        )}
        <DragOverlay adjustScale={false} className="flex justify-center items-center">
          {overlay}
        </DragOverlay>
      </DndContext>
    </>
  );
}

const Visible = ({ items, columns, bulkEdit }) => {
  const { setNodeRef } = useDroppable({ id: "show" });
  const renderable = items.visible

  const getRenderedItems = () => {
    return renderable.map((token, index) => (
      <div key={token.mint + "visible"}>
        <SortablePhoto
          key={token.mint}
          mint={token.mint}
          uri={token.uri}
          index={index}
          height={
            columns === 2
              ? 350
              : columns === 3
                ? 250
                : columns === 4
                  ? 200
                  : 150
          }
          section="visible"
          bulkEdit={bulkEdit}
        />
      </div>
    ))
  }
  const renderedItems = getRenderedItems()
  
  //NEEDS TO FIGURE OUT DRAGGING outside constinaers for virtualized list to work
  // const getVirtualItems = () => { 
  //   const virtualizedList = [[]]
  //   const rowIndex = 0
  //   renderable.forEach((token, index) => {
  //     let row = virtualizedList[rowIndex]
  //     if (row.length >= columns) {
  //       rowIndex++
  //       virtualizedList.push([])
  //       row = virtualizedList[rowIndex]
  //     }
  //     row.push(<div key={token.mint+"visible"}>
  //       <SortablePhoto
  //         key={token.mint}
  //         mint={token.mint}
  //         uri={token.uri}
  //         index={index}
  //         height={
  //           columns === 2
  //             ? 350
  //             : columns === 3
  //               ? 250
  //               : columns === 4
  //                 ? 200
  //                 : 150
  //         }
  //         section="visible"
  //         bulkEdit={bulkEdit}
  //       />
  //     </div>
  //     )
  //   })
  //   return virtualizedList
  // }

  // const virtualItems = getVirtualItems()

  // function cellRenderer({ columnIndex, key, rowIndex, style }) {
  //   return (
  //     <div key={key} style={style}>
  //       {virtualItems[rowIndex][columnIndex]}
  //     </div>
  //   );
  // }

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-dark2 sm:overflow-x-scroll h-full sm:h-[86vh]"
    >
      <SortableContext
        id="visible"
        items={renderable.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={columns}>
          {renderedItems}
        </Grid>
      </SortableContext>
    </div>
  );
};

const Hidden = ({ items }) => {
  const { setNodeRef } = useDroppable({ id: "hide" });
  const [llIndex, setllIndex] = useState(0)
  const renderable = items.hidden//.slice(0, llIndex)
  const handleLazyLoad = () => setllIndex(prev => prev + 9);

  const renderedItems = () => {
    return renderable.map((token, index) => (
      <div key={token.mint + "hidden"}>
        <SortablePhoto
          key={token.mint}
          mint={token.mint}
          uri={token.uri}
          index={index}
          height={150}
          section="hidden"
        />
      </div>

    ))
  }

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-dark2 overflow-x-scroll h-[50vh]"
    >
      <SortableContext
        id="hidden"
        items={renderable.map((i) => i.mint)}
        strategy={rectSortingStrategy}
      >
        <Grid columns={2}>
          {renderedItems()}
        </Grid>
      </SortableContext>
      {/* {llIndex < items.visible.length ? <LazyLoader cb={handleLazyLoad} rootMargin="200px" /> : null} */}
    </div>
  );
};

const OverlayImage = ({ mint, tokens }) => {
  // const token = tokens.find((t) => t.mint === mint);

  return (
    <CloudinaryImage
      id={`${process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ mint }`}
      mint={mint}
      width={150}
      height={150}
      className="w-[150px] h-[150px] cursor-pointer object-center object-cover shadow-sm bg-gray-400/50 rounded-lg"
      noLazyLoad
      noFallback
    />
  );
};
