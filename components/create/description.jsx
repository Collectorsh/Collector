import clsx from "clsx"

const DescriptionInput = ({
  description, setDescription, setError,
  placeholder = "Description of your artwork",
  paletteClass = "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
}) => { 
  const limit = 1000

  const handleChange = (e) => { 
    setDescription(e.target.value)
    if (e.target.value.length > limit) setError(prev => ({
      ...prev,
      description: `Descriptions can be no more than ${limit} characters.`
    }))
    else setError(prev => ({ ...prev, description: null }))
  }

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Description</p>
      <textarea
        className={clsx("px-3.5 py-2 outline-none rounded-md border-2 w-full h-24",
          paletteClass  
        )}
        onChange={handleChange}
        value={description}
        placeholder={placeholder}
      />
      <p className={clsx(
        "float-right text-sm mr-4",
        (description.length > limit) && "text-red-500"
      )}
      >{description.length}/{limit}</p>
    </div>

  )
}

export default DescriptionInput