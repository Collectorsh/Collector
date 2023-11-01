import { InformationCircleIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import Tippy from "@tippyjs/react"

const AttributesInput = ({ attributes, setAttributes }) => {
  
  // const handleChange = (callback) => {
  //   setCreators(prev => {
  //     const newCreators = typeof callback === "function" ? callback(prev) : callback //mimic setState functionality
  //     return newCreators
  //   })
  // }

  const addAttribute = () => { 
    setAttributes(prev => [
      ...prev,
      {
        trait_type: "",
        value: "",
      }
    ])
  }

  const info = (
    <Tippy
      content="The wallet address and share of royalties for each creator."
      className="shadow-lg"
    >
      <InformationCircleIcon className="w-4" />
    </Tippy>
  )


  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 flex">Attributes</p>
      <div className=" border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
        {attributes.map((attribute, i) => (<AttributesItem key={"attribute"+i} index={i} handleChange={setAttributes} attribute={attribute} />))}
        <button
          onClick={addAttribute}
          className={clsx(
            "w-full h-10 p-0 flex items-center justify-center gap-2 hover:scale-105 active:scale-100 duration-300",
            )}
            >
          Add Attribute<PlusIcon className="inline-block w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default AttributesInput

const AttributesItem = ({ attribute, index, handleChange }) => {

  const removeAttribute = () => {
    handleChange(prev => prev.filter((_, i) => i !== index))
  }

  const editTraitType = (e) => {
    handleChange(prev => { 
      const newAttributes = [...prev]
      newAttributes[index].trait_type = e.target.value
      return newAttributes
    })
  }

  const editValue = (e) => {
    handleChange(prev => { 
      const newAttributes = [...prev]
      newAttributes[index].value = e.target.value
      return newAttributes
    })
  }

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="grid grid-cols-2 gap-4 w-full">
        <input
          className={clsx("bg-transparent outline-none border-b-2 border-neutral-300 dark:border-neutral-700 w-full pl-1")}
          type="text"
          value={attribute.trait_type}
          onChange={editTraitType}
          placeholder="Trait Type"
        />

        <input
          className={clsx("bg-transparent outline-none border-b-2 border-neutral-300 dark:border-neutral-700 w-full pl-1")}
          type="text"
          value={attribute.value}
          onChange={editValue}
          placeholder="Value"
        />
      </div>
      <button onClick={removeAttribute} className={clsx("duration-200 hover:scale-105 active:scale-100 opacity-50 hover:opacity-100")}>
        <XIcon className="w-5 h-5" />
      </button>

    </div>
  )
}