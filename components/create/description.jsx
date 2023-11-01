import clsx from "clsx"

const DescriptionInput = ({
  description, setDescription, setError,
  placeholder = "Describe your artwork."
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
        className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-32 p-3
        "
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