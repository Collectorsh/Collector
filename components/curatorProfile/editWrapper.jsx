import { CogIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import MainButton from "../MainButton";
import * as Icon from 'react-feather'

const EditWrapper = ({
  children,
  isOwner,
  onEdit,
  placement,
  text,
  icon = <Icon.Settings size={20} strokeWidth={2.5} />,
  groupHoverClass,
  className
}) => { 
  
  const getPlacement = () => {
    switch (placement) { 
      case "inside-tr": return "top-4 right-4";
      case "tr": return "-top-2 -right-2";
      case "outside-tr": return "-top-4 -right-6";
      case "inside-br": return "bottom-6 right-6";
      default: return placement;
    }
  }

  // const editButton = (
  //   <button
  //     disabled={!isOwner}
  //     onClick={onEdit}
  //     className={clsx("absolute z-[19]", getPlacement(),
  //       "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700",
  //       "rounded-full shadow-md shadow-black/20",
  //       "duration-300 opacity-50 hover:opacity-100",
  //       groupHoverClass,
  //     )}
  //   >
  //     {icon}
  //   </button>
  // )
  const editButton = (
    <MainButton
      disabled={!isOwner}
      onClick={onEdit}
      noPadding={!text}
      className={clsx(
        "flex items-center gap-3 duration-300 opacity-50",
        "absolute z-[19]", getPlacement(),
        !text && "rounded-full",
        groupHoverClass)}
    >
      {text}
      {icon}
    </MainButton>
  )
  return (
    <div className={clsx("inline-block relative h-full w-full", className)}>
      {isOwner && editButton}
      {children}
    </div>
  )
}

export default EditWrapper;