import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { Fragment, useState } from "react"

const types = [
  { type: "single", display: "1 of 1" },
  { type: "edition", display: "Editions" },
  // { type: "open", display: "Open Editions" },
]

const NftTypeInput = ({ maxSupply, setMaxSupply, setError }) => { 

  const [nftType, setNftType] = useState(types[0])

  const isEditions = nftType.type === "edition"

  const handleChange = (type) => {
    setNftType(type)
    if (type.type === "single") setMaxSupply(0)
    else setMaxSupply(2)

    setError(prev => ({ ...prev, maxSupply: null }))
  }

  const handleSupplyChange = (e) => { 
    const value = Math.round(e.target.value) //must be an integer
    setMaxSupply(value)

    if (value < 2) setError(prev => ({ ...prev, maxSupply: "Edition max supply must be at least 2." }))
    else setError(prev => ({ ...prev, maxSupply: null }))
  }

  return (

      <div className={clsx("grid", isEditions ? "grid-cols-2 gap-2" : "")}>
        <div className="relative">
          <p className="font-bold text-lg mb-1 ml-4">Type</p>
          <Listbox value={nftType} onChange={handleChange}>
            <Listbox.Button className="text-current border-4 
                rounded-xl border-neutral-200 dark:border-neutral-700 
                bg-neutral-100 dark:bg-neutral-900
                w-full h-fit p-3 flex items-center
              "
            >
              {nftType.display} <ChevronDownIcon className="w-5 h-5" />
            </Listbox.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="absolute top-0 left-0 w-full bg-white dark:bg-black p-2 rounded-lg shadow">
                {types.map((type) => (
                  <Listbox.Option key={type.type} value={type}>
                    {({ active, selected }) => (
                      <li
                        className={clsx(
                          "p-2 flex gap-1 items-center w-full cursor-pointer rounded",
                          active ? 'bg-neutral-500/25' : '',
                          // selected ? 'bg-neutral-500/50' : ''
                        )}
                      >
                        {type.display}
                        {selected && <CheckIcon className="w-6 h-6" />}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

      {isEditions ? (
        <div>
          <p className="font-bold text-lg mb-1 ml-4">Max Supply</p>
          <div className="flex w-full border-4 p-3 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
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