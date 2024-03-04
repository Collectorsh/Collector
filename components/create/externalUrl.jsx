import clsx from "clsx"

const ExternalUrlInput = ({
  externalUrl,
  setExternalUrl,
}) => {

  const handleChange = (e) => {
    setExternalUrl(e.target.value)
  }

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">External Url</p>
      <input 
        type="text"
        className=" rounded-md border-2 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800
          w-full px-3.5 py-2 outline-none
        "
        onChange={handleChange}
        value={externalUrl}
        placeholder={"https://your_website.com"}
      />
    </div>

  )
}

export default ExternalUrlInput