import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'
import dynamic from 'next/dynamic';
import clsx from "clsx";

const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const CurationDescription = ({ description, displayDraftEdit, setEditDescriptionOpen }) => { 
  return (
    <div className={clsx(
      "group/description w-full mx-auto rounded-md border-4 border-transparent",
      displayDraftEdit && "duration-300 border-dashed border-neutral-200/40 dark:border-neutral-700/40 hover:border-neutral-200 hover:dark:border-neutral-700",
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