import clsx from "clsx"

const NameForm = ({ name, setName, setError }) => {
  const limit = 32

  const handleChange = (e) => {
    setName(e.target.value)
    if (e.target.value.length > limit) setError(prev => ({
      ...prev,
      name: "Names can be no more than 32 characters."
    }))
    else setError(prev => ({ ...prev, name: null }))
  }

  return (
    <div className="my-4">
      <p className="font-bold text-lg mb-1 ml-4">Name*</p>
      <input 
        type="text"
        className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-3
        "
        onChange={handleChange}
        value={name}
        placeholder="What is the title of your artwork."
      />
      <p className={clsx(
        "float-right text-sm mr-4",
        (name.length > limit) && "text-red-500"
      )}
      >{name.length}/{limit}</p>
    </div>

  )
}

export default NameForm