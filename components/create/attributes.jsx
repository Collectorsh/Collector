
import clsx from "clsx"
import Tippy from "@tippyjs/react"
import * as Icon from 'react-feather'

const AttributesInput = ({ attributes, setAttributes }) => {
  
  const addAttribute = () => { 
    setAttributes(prev => [
      ...prev,
      {
        trait_type: "",
        value: "",
      }
    ])
  }

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 flex">Attributes</p>
      <div className="w-full px-3.5 py-2 outline-none rounded-md border-2 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
        {attributes.map((attribute, i) => (<AttributesItem key={"attribute"+i} index={i} handleChange={setAttributes} attribute={attribute} />))}
        <button
          onClick={addAttribute}
          className={clsx(
            "w-full h-10 flex items-center justify-center gap-1.5 hoverPalette2 rounded-md px-2",
          )}
            >
          Add Attribute
          <Icon.Plus size={18} strokeWidth={2.5} />
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
          className={clsx("bg-transparent outline-none border-b-2 borderPalette2 w-full pl-1")}
          type="text"
          value={attribute.trait_type}
          onChange={editTraitType}
          placeholder="Trait Type"
        />

        <input
          className={clsx("bg-transparent outline-none border-b-2 borderPalette2 w-full pl-1")}
          type="text"
          value={attribute.value}
          onChange={editValue}
          placeholder="Value"
        />
      </div>
      <button onClick={removeAttribute} className={clsx("duration-300 opacity-50 hover:opacity-100")}>
        <Icon.X size={20} />
      </button>

    </div>
  )
}