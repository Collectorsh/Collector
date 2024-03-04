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
  groupHoverClass = "hover:opacity-100",
  className,
  buttonClassName
}) => { 
  
  const getPlacement = () => {
    switch (placement) { 
      case "inside-tr": return "top-4 right-4";
      case "tr": return "-top-1 -right-1";//"-top-2 -right-2";
      case "outside-tr": return "-top-6 -right-6";
      case "inside-br": return "bottom-6 right-6";
      default: return placement;
    }
  }
  const editButton = text
    ? (
      <MainButton
        size="lg"
      disabled={!isOwner}
      onClick={onEdit}
      className={clsx(
        "flex items-center gap-3 duration-300",
        "absolute z-[19]", getPlacement(),
        groupHoverClass, buttonClassName)}
    >
      {text}
      {icon}
    </MainButton>
    )
    : (
      <button
        disabled={!isOwner}
        onClick={onEdit}
        className={clsx(
          "flex items-center gap-3 duration-300",
          "absolute z-[19]", getPlacement(),
          groupHoverClass,
          buttonClassName || "rounded-lg border-4 palette1 border-neutral-200 dark:border-neutral-700 p-1 origin-top-right",
        )}
      >
        {icon}
      </button>
    )
  return (
    <div
      className={clsx(
        "relative h-full w-full",
         isOwner && "cursor-pointer",
        className
      )}
      onClick={onEdit}
    >
      {isOwner && editButton}
      <div className={isOwner && "pointer-events-none"}>
        {children}
      </div>
    </div>
  )
}

export default EditWrapper;