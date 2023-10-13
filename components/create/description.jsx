import clsx from "clsx"
import { REQUIRED } from "../../pages/create"

const DescriptionInput = ({ description, setDescription, setError }) => { 
  const limit = 1000

  const handleChange = (e) => { 
    setDescription(e.target.value)
    const isUndefined = !e.target.value
    if (isUndefined) setError(prev => ({ ...prev, description: REQUIRED }))
    else if (e.target.value.length > limit) setError(prev => ({
      ...prev,
      description: `Descriptions can be no more than ${limit} characters.`
    }))
    else setError(prev => ({ ...prev, description: null }))
  }

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Description*</p>
      <textarea
        className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-32 p-3
        "
        onChange={handleChange}
        value={description}
        placeholder="Describe your artwork."
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