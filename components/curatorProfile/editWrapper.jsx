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
      case "tr": return "-top-2 -right-2";
      case "outside-tr": return "-top-6 -right-6";
      case "inside-br": return "bottom-6 right-6";
      default: return placement;
    }
  }
  const editButton = text
    ? (
    <MainButton
      disabled={!isOwner}
      onClick={onEdit}
      className={clsx(
        "flex items-center gap-3 duration-300 opacity-50",
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
          "flex items-center gap-3 duration-300 opacity-50 rounded-full",
          "absolute z-[19]", getPlacement(),
          groupHoverClass, buttonClassName)}
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