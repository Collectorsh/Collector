import React, { useState, useEffect } from "react";
import { success, error } from "/utils/toast";
import DragAndDrop from "/components/dashboard/gallery/DragAndDrop";
import Hidden from "/components/dashboard/gallery/Hidden";
import Actions from "/components/dashboard/gallery/Actions";
import update from "immutability-helper";
import saveLayout from "/data/dashboard/saveLayout";
import cloneDeep from "lodash/cloneDeep";
import { ViewGridIcon } from "@heroicons/react/solid";

export default function CollectionContainer({ tkns, user }) {
  const [tokens, setTokens] = useState([]);
  const [size, setSize] = useState(48);

  useEffect(() => {
    if (!tkns) return;
    // Add an id for dnd
    for (let i = 0; i < tkns.length; i += 1) {
      tkns[i].id = i;
    }
    setTokens(tkns);
  }, [tkns]);

  return (
    <div className="dark:bg-black min-h-screen pb-12 mt-16">
      <div className="mb-12">
        <h2 className="text-5xl font-extrabold text-black w-fit py-1 inline-block dark:text-whitish">
          Edit Gallery
        </h2>
        <p className="dark:text-white">Drag and drop to curate your gallery.</p>
      </div>

      <h2 className="border-b border-b-black dark:border-b-white align-middle text-3xl font-extrabold mb-8 text-black w-fit py-1 inline-block dark:text-whitish">
        Visible
      </h2>

      <Actions
        toggleVisibility={toggleVisibility}
        handleSaveLayout={handleSaveLayout}
        tokens={tokens}
      />

      <div className="">
        <ViewGridIcon
          className={`h-8 w-8 inline cursor-pointer ${
            size === 32 && "text-gray-500 dark:text-whitish"
          }`}
          onClick={(e) => setSize(32)}
          aria-hidden="true"
        />
        <ViewGridIcon
          className={`h-10 w-10 inline cursor-pointer ${
            size === 48 && "text-gray-500 dark:text-whitish"
          }`}
          onClick={(e) => setSize(48)}
          aria-hidden="true"
        />
      </div>

      <div className="clear-both mt-3 mb-10">
        <div className="flex flex-wrap gap-6">
          <DragAndDrop
            tokens={tokens}
            moveCard={moveCard}
            toggleVisibilityOne={toggleVisibilityOne}
            setTokenAcceptOffers={setTokenAcceptOffers}
            size={size}
          />
        </div>

        <h2 className="border-b border-b-black dark:border-b-white text-3xl font-extrabold mb-8 text-black w-fit py-1 inline-block mt-8 dark:text-whitish">
          Hidden
        </h2>

        <div className="flex flex-wrap gap-6">
          {Array.isArray(tokens) &&
            tokens.map((token, index) => {
              if (!token.visible)
                return (
                  <Hidden
                    key={token.id}
                    token={token}
                    setVisibility={toggleVisibilityOne}
                    size={size}
                  />
                );
            })}
        </div>
      </div>
    </div>
  );

  async function setTokenAcceptOffers(mint, accepting) {
    const clonedItems = cloneDeep(tokens);
    let mint_id;
    for (let i = 0; i < clonedItems.length; i += 1) {
      if (clonedItems[i].mint === mint) mint_id = i;
    }
    let new_el = clonedItems[mint_id];
    new_el.accept_offers = accepting;
    setTokens(clonedItems);
  }

  async function handleSaveLayout(e) {
    e.preventDefault();

    let tkns = tokens.map((token) => ({
      mint: token.mint,
      visible: token.visible,
      order_id: token.order_id,
      accept_offers: token.accept_offers,
    }));
    saveLayout(user.api_key, tkns)
      .then((res) => {
        if (res.data.status === "error") {
          error(res.data.msg);
        } else {
          success("Layout saved");
        }
      })
      .catch((err) => {
        console.log(err);
        error("An error has occurred");
      });
  }

  function resetIds(tkns) {
    let dndId = 0;
    for (let i = 0; i < tkns.length; i += 1) {
      if (tkns[i].visible === true) {
        tkns[i].id = dndId;
        tkns[i].order_id = dndId + 1;
        dndId += 1;
      }
    }
    for (let i = 0; i < tkns.length; i += 1) {
      if (tkns[i].visible !== true) {
        tkns[i].id = dndId;
        tkns[i].order_id = dndId + 1;
        dndId += 1;
      }
    }
    return tkns;
  }

  async function toggleVisibility(vis) {
    // set metadata visibility
    const clonedItems = cloneDeep(tokens);
    for (let i = 0; i < clonedItems.length; i += 1) {
      clonedItems[i].visible = vis;
    }
    setTokens(resetIds(clonedItems));
  }

  async function toggleVisibilityOne(vis, mint) {
    // set metadata visibility
    const clonedItems = cloneDeep(tokens);
    let mint_id;
    for (let i = 0; i < clonedItems.length; i += 1) {
      if (clonedItems[i].mint === mint) mint_id = i;
    }
    let new_el = clonedItems[mint_id];
    new_el.visible = vis;
    clonedItems.splice(mint_id, 1);

    if (vis === true) {
      clonedItems.push(new_el);
    } else {
      clonedItems.unshift(new_el);
    }
    setTokens(resetIds(clonedItems));
  }

  async function moveCard(dragIndex, hoverIndex) {
    const dragCard = tokens[dragIndex];
    setTokens(
      update(tokens, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })
    );
    let drag_order_id = tokens[dragIndex].order_id;
    let hover_order_id = tokens[hoverIndex].order_id;

    tokens[dragIndex].order_id = hover_order_id;

    if (drag_order_id > hover_order_id) {
      let new_id = hover_order_id + 1;
      for (let i = 0; i < tokens.length; i += 1) {
        if (tokens[i].visible !== true) continue;
        if (tokens[i].order_id <= hover_order_id) continue;
        new_id += 1;
        tokens[i].order_id = new_id;
      }
    } else {
      let new_id = 1;
      for (let i = 0; i < tokens.length; i += 1) {
        if (tokens[i].visible !== true) continue;
        if (tokens[i].order_id >= hover_order_id) continue;
        tokens[i].order_id = new_id;
        new_id += 1;
      }
    }

    tokens[dragIndex].order_id = hover_order_id;
    let target_new_id =
      drag_order_id > hover_order_id ? hover_order_id + 1 : hover_order_id - 1;
    tokens[hoverIndex].order_id = target_new_id;
  }
}
