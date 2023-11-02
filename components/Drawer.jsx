import { ChevronDownIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useState } from "react"

const Drawer = ({ children, title, wrapperClass, drawerClass, buttonClass }) => { 
  const [open, setOpen] = useState(false)
  return (
    <div className={wrapperClass}>
      <button
        className={clsx("flex items-center duration-300 hover:scale-105 active:scale-100 ", buttonClass)}
        onClick={() => setOpen(prev => !prev)}
      >
        {title}
        <ChevronDownIcon className={clsx("w-5 h-5 duration-300", open ? "-rotate-180": "rotate-0")} />
      </button>

      <div
        className={clsx("duration-500 overflow-hidden",
          drawerClass,
          open ? "h-auto  p-4" : "h-0  py-0 px-4"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Drawer