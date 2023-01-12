import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { success, error } from "/utils/toastMessages";
import saveLayout from "/data/dashboard/saveLayout";

export default function Settings({ items, user, columns, hideAll, showAll }) {
  const [saving, setSaving] = useState(false);

  const doSaveLayout = async () => {
    const updatedItems = [];
    for (const [index, i] of items.visible.entries()) {
      i.order_id = index + 1;
      i.visible = true;
      updatedItems.push(i);
    }
    for (const [index, i] of items.hidden.entries()) {
      i.order_id = index + 1;
      i.visible = false;
      updatedItems.push(i);
    }
    setSaving(true);
    const res = await saveLayout(user.api_key, updatedItems, columns);
    if (res.data.status === "success") success("Layout saved");
    else error(res.msg);
    setSaving(false);
  };

  return (
    <>
      <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mb-4">
        Settings
      </h2>
      <button
        className="w-[49%] py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
        onClick={() => hideAll()}
      >
        <span>Hide All</span>
      </button>
      <button
        className="w-[49%] float-right py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
        onClick={() => showAll()}
      >
        <span>Show All</span>
      </button>
      <button
        className="w-full mt-4 py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
        onClick={() => doSaveLayout()}
      >
        {saving ? (
          <span className="w-fit mx-auto">
            <Oval color="#FFF" secondaryColor="#666" height={20} width={20} />
          </span>
        ) : (
          <span>Save Layout</span>
        )}
      </button>
    </>
  );
}
