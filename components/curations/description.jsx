import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'
import dynamic from 'next/dynamic';
import clsx from "clsx";

const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const CurationDescription = ({ description, displayDraftEdit, setEditDescriptionOpen }) => { 
  return (
    <div className={clsx(
      "group/description w-full mx-auto rounded-md border-4 border-transparent",
      displayDraftEdit && "duration-300 border-dashed border-zinc-200/40 dark:border-zinc-700/40 hover:border-zinc-200 hover:dark:border-zinc-700",
    )}>
      <EditWrapper
        isOwner={displayDraftEdit}
        onEdit={() => setEditDescriptionOpen(true)}
        placement="tr"
        groupHoverClass="group-hover/description:opacity-100"
        text="Edit Description"
        icon={<Icon.Edit size={20} strokeWidth={2.5} />}
      >
        <QuillContent textDelta={description} />
      </EditWrapper>
    </div>
  )
}

export default CurationDescription