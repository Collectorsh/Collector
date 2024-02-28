import clsx from "clsx"
import { REQUIRED } from "../../pages/create"

const NameInput = ({
  name, setName, setError,
  placeholder = "The title of your artwork",
  paletteClass = "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
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
      <p className="font-bold text-lg mb-1 ml-4">Name</p>
      <input 
        type="text"
        className={clsx("w-full px-3.5 py-2 outline-none rounded-md border-2", paletteClass)}
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