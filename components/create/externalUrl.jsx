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
        className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-3
        "
        onChange={handleChange}
        value={externalUrl}
        placeholder={"https://your_website.com"}
      />
    </div>

  )
}

export default ExternalUrlInput