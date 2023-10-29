import clsx from "clsx"
import { REQUIRED } from "../../pages/create"

const NameInput = ({
  name, setName, setError,
  placeholder = "What is the title of your artwork."
}) => {
  const limit = 32

  const handleChange = (e) => {
    setName(e.target.value)
    const isUndefined = !e.target.value
    if (isUndefined) setError(prev => ({ ...prev, name: REQUIRED }))
    else if (e.target.value.length > limit) setError(prev => ({
      ...prev,
      name: `Names can be no more than ${limit} characters.`
    }))
    else setError(prev => ({ ...prev, name: null }))
  }

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Name*</p>
      <input 
        type="text"
        className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-3
        "
        onChange={handleChange}
        value={name}
        placeholder={placeholder}
      />
      <p className={clsx(
        "float-right text-sm mr-4",
        (name.length > limit) && "text-red-500"
      )}
      >{name.length}/{limit}</p>
    </div>

  )
}

export default NameInput