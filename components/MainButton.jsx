import clsx from "clsx"

const MainButton = ({ children, solid = false, className, disabled, ...props }) => (
  <button
    disabled={disabled}
    className={clsx("border-2 border-black dark:border-white",
      "dark:hover:no-touch:bg-neutral-200 hover:no-touch:border-neutral-700 dark:hover:no-touch:border-neutral-200",
      solid
        ? "bg-black dark:bg-white text-white dark:text-black hover:no-touch:bg-neutral-700"
        : "hover:no-touch:bg-neutral-700 dark:hover:no-touch:bg-neutral-200 hover:no-touch:text-white dark:hover:no-touch:text-black",
      "rounded-lg duration-300 hover:scale-105 active:scale-100",
      "text-lg font-bold py-3 px-6",
      "disabled:scale-100 disabled:opacity-50",
      solid
        ? "disabled:bg-black dark:disabled:bg-white disabled:border-black dark:disabled:border-white"
        : "disabled:bg-transparent dark:disabled:bg-transparent disabled:border-black dark:disabled:border-white disabled:text-black dark:disabled:text-white", 
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export default MainButton