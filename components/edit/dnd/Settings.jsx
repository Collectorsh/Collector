import React, { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import { success, error } from "/utils/toastMessages";
import saveLayout from "/data/dashboard/saveLayout";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { useImageFallbackContext } from "../../../contexts/imageFallback";

export default function Settings({
  items,
  user,
  columns,
  setColumns,
  hideAll,
  showAll,
}) {
  const [saving, setSaving] = useState(false);
  const { uploadAll } = useImageFallbackContext()

  const doSaveLayout = async () => {
    const { visible, hidden } = items

    const updatedVisible = visible.map((item, index) => { 
      return {
        ...item,
        order_id: index + 1,
        visible: true
      }
    })
    const updatedHidden = hidden.map((item, index) => { 
      return {
        ...item,
        order_id: index + 1,
        visible: false
      }
    })

    const updatedItems = [...updatedVisible, ...updatedHidden]

    const check = {}
    updatedItems.forEach((item) => { 
      if (check[item.mint]) check[item.mint]++
      else check[item.mint] = 1
    })

    setSaving(true);
    const res = await saveLayout(user.api_key, updatedItems, columns);
    if (res.data.status === "success") {
      success("Layout saved");
      await uploadAll(updatedVisible)//will optimized any visible images not optimized yet
    } else error(res.msg);
    setSaving(false);
  }

  return (
    <div className="mt-2">
      <button
        className="mb-3 w-[49%] py-2.5 px-4 rounded-3xl bg-gray-200 text-black dark:bg-dark3 dark:text-white cursor-pointer hover:bg-gray-100 hover:dark:bg-dark1 font-bold"
        onClick={() => hideAll()}
      >
        <span>Hide All</span>
      </button>
      <button
        className="mb-3 w-[49%] float-right py-2.5 px-4 rounded-3xl bg-gray-200 text-black dark:bg-dark3 dark:text-white cursor-pointer hover:bg-gray-100 hover:dark:bg-dark1 font-bold"
        onClick={() => showAll()}
      >
        <span>Show All</span>
      </button>
      
      <button
        onClick={doSaveLayout}
        disabled={saving}
        className="
          border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black
          py-3 px-6 rounded-lg text-lg font-bold duration-300 active:scale-95
          w-full disabled:scale-100 disabled:hover:bg-inherit disabled:hover:text-inherit"
        >
        {saving ? (
          <span className="w-fit mx-auto inline-block">
            <Oval color="#FFF" secondaryColor="#666" height={20} width={20} />
          </span>
        ) : (
          <span>Save Layout</span>
        )}
      </button>
      <h2 className="bg-gray-100 dark:bg-dark3 w-full uppercase rounded p-2 text-center mt-4 mb-1">
        <span className="align-middle">Columns</span>
        <Tippy
          content={`The number of columns to display when viewing your gallery`}
          className="bg-gray-300 align-middle"
        >
          <QuestionMarkCircleIcon
            className="ml-2 inline h-6 w-6 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-greeny dark:hover:text-greeny"
            aria-hidden="true"
          />
        </Tippy>
      </h2>
      <div className="grid w-full grid-cols-4 space-x-2 rounded-xl p-2">
        <div>
          <input
            type="radio"
            name="option"
            id="2"
            className="peer hidden"
            onClick={() => setColumns(2)}
            defaultChecked={columns === 2}
          />
          <label
            htmlFor="2"
            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-greeny peer-checked:font-bold peer-checked:text-white"
          >
            2
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="option"
            id="3"
            className="peer hidden"
            onClick={() => setColumns(3)}
            defaultChecked={columns === 3}
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
            onClick={() => setColumns(4)}
            defaultChecked={columns === 4}
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
            onClick={() => setColumns(5)}
            defaultChecked={columns === 5}
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
