import clsx from "clsx"
import { useState } from "react"
import * as Icon from "react-feather"
const Drawer = ({ children, title, wrapperClass, drawerClass, buttonClass }) => { 
  const [open, setOpen] = useState(false)
  return (
    <div className={wrapperClass}>
      <button
        className={clsx("flex items-center gap-1 rounded-md hoverPalette1 px-2 relative -left-2", buttonClass)}
        onClick={() => setOpen(prev => !prev)}
      >
        {title}
        <Icon.ChevronDown size={18} strokeWidth={2.5} className={clsx("duration-300 flex-shrink-0", open ? "-rotate-180": "rotate-0")} />
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