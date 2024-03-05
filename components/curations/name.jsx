import clsx from "clsx"
import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'

const CurationName = ({ name, displayPublishedEdit, setEditNameOpen }) => { 
  return (
    <div className={clsx(
      "group/name mb-0 mx-auto w-full rounded-lg border-4",
      displayPublishedEdit
        ? "duration-300 border-dashed border-neutral-300/60 dark:border-neutral-700/60 hover:border-neutral-300 hover:dark:border-neutral-700"
        : "border-transparent",
    )}>
      <EditWrapper
        isOwner={displayPublishedEdit}
        onEdit={() => setEditNameOpen(true)}
        placement="tr"
        groupHoverClass="group-hover/name:opacity-100 group-hover/name:scale-105"
        // text="Edit Name"
        icon={<Icon.Edit size={24} strokeWidth={2.5} />}
      >
        <h1 className="font-bold text-center w-full text-4xl md:text-5xl overflow-y-hidden overflow-x-auto py-1.5">{name.replaceAll("_", " ")}</h1>
      </EditWrapper>
    </div>
  )
}

export default CurationName