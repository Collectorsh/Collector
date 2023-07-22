import { CogIcon } from "@heroicons/react/solid";
import clsx from "clsx";

const EditWrapper = ({
  children,
  isOwner,
  onEdit,
  placement,
  icon = <CogIcon className="w-8 h-8" />,
  groupHoverClass,
  className
}) => { 
  
  const getPlacement = () => {
    switch (placement) { 
      case "inside-tr": return "top-4 right-4";
      case "tr": return "top-0 right-0";
      case "outside-tr": return "-top-4 -right-4";
    }
  }

  const editButton = (
    <button
      disabled={!isOwner}
      onClick={onEdit}
      className={clsx("absolute z-[19]", getPlacement(),
        "bg-neutral-200 dark:bg-neutral-700 rounded-full p-1 shadow-lg dark:shadow-white/10",
        "duration-300 opacity-30 hover:opacity-100",
        groupHoverClass,
        "hover:scale-110 active:scale-100",
      )}
    >
      {icon}
    </button>
  )
  return (
    <div className={clsx("inline-block relative h-full w-full", className)}>
      {isOwner && editButton}
      {children}
    </div>
  )
}

export default EditWrapper;