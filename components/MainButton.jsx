import clsx from "clsx"
import { forwardRef } from "react"

const MainButton = forwardRef(({ children, solid = false, className, disabled, noPadding, size, ...props }, ref) => {

  const bgClass = solid
    ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
    : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800"

  const disabledClass = solid
  ? "disabled:bg-zinc-900 dark:bg-zinc-100"
  : "disabled:bg-zinc-100 dark:bg-zinc-900"
  
  const sizeClass = () => {
    if (noPadding) return ""
    switch (size) {
      case "xl": return "py-3 px-8 text-xl rounded-lg "
      case "lg": return "py-1.5 px-6 text-lg rounded-lg "
      case "md":
      default: return "py-1 px-4 text-base rounded-md"
    }
  }
  
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx("border-2 border-zinc-900 dark:border-zinc-100",
        " hover:border-zinc-700 dark:hover:border-zinc-300",
        bgClass,
        "disabled:border-zinc-900 dark:disabled:border-zinc-100",
        "disabled:opacity-50",
        "rounded-lg duration-300",
        "font-bold",
        sizeClass(),
        disabledClass,
        className
      )}
      {...props}
    >
      {children}
    </button>

  )
})

MainButton.displayName = "MainButton"

export default MainButton

export const WarningButton = ({ children, className, disabled, noPadding, warning, size, ...props }) => {
  const sizeClass = () => {
    if (noPadding) return ""
    switch (size) {
      case "xl": return "py-3 px-8 text-xl rounded-lg "
      case "lg": return "py-1.5 px-6 text-lg rounded-lg "
      case "md":
      default: return "py-1 px-4 text-base rounded-md"
    }
  }
  return (
    <button
      disabled={disabled}
      className={clsx("border-2 border-red-500 text-red-500",
        "hover:border-red-600",
        "hover:bg-red-600/20",
        "duration-300",
        "font-bold",
        sizeClass(),
        "disabled:opacity-50",
        "disabled:bg-transparent dark:disabled:bg-transparent disabled:border-red-500 disabled:text-red-500",
        className
      )}
      {...props}
    >
      {children}
    </button>

  )
}