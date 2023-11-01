import { ChevronDownIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useState } from "react"

const Drawer = ({ children, title, wrapperClass }) => { 
  const [open, setOpen] = useState(false)
  return (
    <div className={wrapperClass}>
      <button
        className="mx-auto flex items-center font-bold text-lg my-2"
        onClick={() => setOpen(prev => !prev)}
      >
        {title}
        <ChevronDownIcon className={clsx("w-5 h-5 duration-300", open ? "-rotate-180": "rotate-0")} />
      </button>

      <div
        className={clsx("duration-500 overflow-hidden",
          "border-4 rounded-xl border-neutral-200 dark:border-neutral-700",
          open ? "h-auto  p-4" : "h-0  py-0 px-4"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Drawer