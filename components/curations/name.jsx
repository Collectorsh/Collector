import clsx from "clsx"
import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'

const CurationName = ({ name, displayPublishedEdit, setEditNameOpen }) => { 
  return (
    <div className={clsx(
      "group/name mb-3 mx-auto w-full rounded-md border-4 border-transparent",
      displayPublishedEdit && "duration-300  border-dashed border-zinc-200/40 dark:border-zinc-700/40 hover:border-zinc-200 hover:dark:border-zinc-700",
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