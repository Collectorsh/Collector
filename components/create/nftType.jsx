import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { useState } from "react"
import * as Icon from 'react-feather'

const types = [
  { type: "single", display: "1 of 1" },
  { type: "edition", display: "Editions" },
  // { type: "open", display: "Open Editions" },
]

const NftTypeInput = ({ maxSupply, setMaxSupply, setError, setIsMutable }) => { 

  const [nftType, setNftType] = useState(types[0])

  const isEditions = nftType.type === "edition"

  const handleChange = (type) => {
    setNftType(type)
    if (type.type === "single") setMaxSupply(0)
    else {
      setMaxSupply(2)
      setIsMutable(true) //master editions must be mutable
    }
    setError(prev => ({ ...prev, maxSupply: null }))
  }

  const handleSupplyChange = (e) => { 
    const value = Math.round(e.target.value) //must be an integer
    setMaxSupply(value)

    if (value < 2) setError(prev => ({ ...prev, maxSupply: "Edition max supply must be at least 2." }))
    else setError(prev => ({ ...prev, maxSupply: null }))
  }

  return (

    <div className={clsx("grid" , isEditions ? "grid-cols-2 gap-2" : "")}>
      <div>
        <p className="font-bold text-lg mb-1 ml-4">Type</p>
        <Listbox value={nftType} onChange={handleChange}>
          {({ open }) => (
            <>
              <Listbox.Button className={clsx("text-current flex gap-1 items-center justify-between",
                  "w-full px-3.5 py-2 outline-none rounded-md border-2 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 hoverPalette1"
              )}>
                {nftType.display} 
                <Icon.ChevronDown size={20} strokeWidth={2.5} className={clsx("duration-300", open && "rotate-180")} />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute top-2 left-0 w-full palette2 p-2 rounded shadow ">
                  {types.map((type) => (
                    <Listbox.Option key={type.type} value={type}>
                      {({ active, selected }) => (
                        <li
                          className={clsx(
                            "p-2 flex gap-1 items-center w-full cursor-pointer rounded",
                            "hoverPalette2",
                          )}
                        >
                          {type.display}
                          {selected && <Icon.Check size={20} strokeWidth={2.5} />}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </>
          )}
        </Listbox>
      </div>

      {isEditions ? (
        <div>
          <p className="font-bold text-lg mb-1 ml-4">Max Supply</p>
          <div className="flex px-3.5 py-2 outline-none rounded-md border-2 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
              <input
                type="number"
                min={2}
                step={1}
                className="outline-none bg-transparent w-full"
                placeholder="Royalty Percentage"
                onChange={handleSupplyChange}
                value={maxSupply}
              />
            </div>
          </div>
        ) : null}

      </div>

  )
}

export default NftTypeInput