import clsx from "clsx"
import { forwardRef } from "react"

const MainButton = forwardRef(({ children, solid = false, className, disabled, noPadding, standardWidth, size, ...props }, ref) => {

  const bgClass = solid
    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 border-neutral-900 dark:border-neutral-100 "
    : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-300 dark:hover:bg-neutral-700 border-neutral-500"

  const disabledClass = solid
    ? "disabled:bg-neutral-900 disabled:dark:bg-neutral-100 disabled:border-neutral-900 dark:disabled:border-neutral-100"
    : "disabled:bg-neutral-100 disabled:dark:bg-neutral-900 border-neutral-500"
  
  const sizeClass = () => {
    if (noPadding) return ""
    switch (size) {
      case "xl": return "py-3.5 px-8 text-xl rounded-lg leading-none"
      case "lg": return "py-2 px-5 text-lg rounded-lg leading-none"
      case "md":
      default: return "py-2 px-4 text-base rounded-md leading-none"
    }
  }
  
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx("border-2 ",
        bgClass,
        "",
        "disabled:opacity-50",
        "duration-300 transition",
        "font-semibold",
        sizeClass(),
        disabledClass,
        standardWidth && "w-28",
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
      case "xl": return "py-3.5 px-8 text-xl rounded-lg leading-none"
      case "lg": return "py-2 px-5 text-lg rounded-lg leading-none"
      case "md":
      default: return "py-2 px-4 text-base rounded-md leading-none"
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