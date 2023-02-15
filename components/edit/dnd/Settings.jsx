import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { success, error } from "/utils/toastMessages";
import saveLayout from "/data/dashboard/saveLayout";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";

export default function Settings({
  items,
  user,
  galleryColumns,
  setGalleryColumns,
  hideAll,
  showAll,
}) {
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
    const res = await saveLayout(user.api_key, updatedItems, galleryColumns);
    if (res.data.status === "success") success("Layout saved");
    else error(res.msg);
    setSaving(false);
  };

  return (
    <div className="mt-2">
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
      <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-4">
        Settings
      </h2>
      <div className="text-center font-bold mt-2">
        Gallery Columns
        <Tippy
          content={`The number of columns to display when viewing your gallery`}
          className="bg-gray-300"
        >
          <QuestionMarkCircleIcon
            className="ml-2 inline h-6 w-6 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-greeny dark:hover:text-greeny"
            aria-hidden="true"
          />
        </Tippy>
      </div>
      <div className="grid w-full grid-cols-3 space-x-2 rounded-xl p-2">
        <div>
          <input
            type="radio"
            name="option"
            id="3"
            className="peer hidden"
            onClick={() => setGalleryColumns(3)}
            defaultChecked={galleryColumns === 3}
          />
          <label
            htmlFor="3"
            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-greeny peer-checked:font-bold peer-checked:text-white"
          >
            3
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="option"
            id="4"
            className="peer hidden"
            onClick={() => setGalleryColumns(4)}
            defaultChecked={galleryColumns === 4}
          />
          <label
            htmlFor="4"
            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-greeny peer-checked:font-bold peer-checked:text-white"
          >
            4
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="option"
            id="5"
            className="peer hidden"
            onClick={() => setGalleryColumns(5)}
            defaultChecked={galleryColumns === 5}
          />
          <label
            htmlFor="5"
            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-greeny peer-checked:font-bold peer-checked:text-white"
          >
            5
          </label>
        </div>
      </div>
    </div>
  );
}
