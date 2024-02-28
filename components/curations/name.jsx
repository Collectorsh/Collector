import clsx from "clsx"
import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'

const CurationName = ({ name, displayPublishedEdit, setEditNameOpen }) => { 
  return (
    <div className={clsx(
      "group/name mb-0 mx-auto w-full rounded-md border-4 border-transparent",
      displayPublishedEdit && "duration-300  border-dashed border-neutral-200/40 dark:border-neutral-700/40 hover:border-neutral-200 hover:dark:border-neutral-700",
    )}>
      <EditWrapper
        isOwner={displayPublishedEdit}
        onEdit={() => setEditNameOpen(true)}
        placement="tr"
        groupHoverClass="group-hover/name:opacity-100"
        text="Edit Name"
        icon={<Icon.Edit size={20} strokeWidth={2.5} />}
      >
        <h1 className="font-bold text-5xl text-center w-full break-words">{name.replaceAll("_", " ")}</h1>
      </EditWrapper>
    </div>
  )
}

export default CurationName