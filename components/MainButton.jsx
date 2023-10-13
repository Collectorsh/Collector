import clsx from "clsx"
import { forwardRef } from "react"

const MainButton = forwardRef(({ children, solid = false, className, disabled, noPadding, warning, ...props }, ref) => {

  const bgClass = solid
    ? "bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-700"
    : "hover:bg-neutral-700 dark:hover:bg-neutral-200 hover:text-white dark:hover:text-black"

  const disabledClass = solid
    ? "disabled:bg-black dark:disabled:bg-white disabled:border-black dark:disabled:border-white"
    : "disabled:bg-transparent dark:disabled:bg-transparent disabled:border-black dark:disabled:border-white disabled:text-black dark:disabled:text-white"
  
  
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx("border-2 border-black dark:border-white",
        "dark:hover:bg-neutral-200 hover:border-neutral-700 dark:hover:border-neutral-200",
        bgClass,
        "rounded-lg duration-300 hover:scale-105 active:scale-100",
        "text-lg font-bold",
        noPadding ? "" : "py-3 px-6",
        "disabled:scale-100 disabled:opacity-50",
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

export const WarningButton = ({ children, className, disabled, noPadding, warning, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={clsx("border-2 border-red-500 text-red-500",
        "hover:border-red-600",
        "hover:bg-red-600 hover:text-white",
        "rounded-lg duration-300 hover:scale-105 active:scale-100",
        "text-lg font-bold",
        noPadding ? "" : "py-3 px-6",
        "disabled:scale-100 disabled:opacity-50",
        "disabled:bg-transparent dark:disabled:bg-transparent disabled:border-red-500 disabled:text-red-500",
        className
      )}
      {...props}
    >
      {children}
    </button>

  )
}