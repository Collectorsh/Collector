import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'
import dynamic from 'next/dynamic';
import clsx from "clsx";

const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const CurationDescription = ({ description, displayDraftEdit, setEditDescriptionOpen }) => { 
  return (
    <div className={clsx(
      "group/description w-full mx-auto rounded-lg border-4",
      displayDraftEdit
        ? "duration-300 border-dashed border-neutral-300/60 dark:border-neutral-700/60 hover:border-neutral-300 hover:dark:border-neutral-700"
        : "border-transparent",
    )}>
      <EditWrapper
        isOwner={displayDraftEdit}
        onEdit={() => setEditDescriptionOpen(true)}
        placement="tr"
        groupHoverClass="group-hover/description:opacity-100 group-hover/description:scale-105"
        // text="Edit Description"
        icon={<Icon.Edit size={24} strokeWidth={2.5} />}
      >
        <QuillContent textDelta={description} />
      </EditWrapper>
    </div>
  )
}

export default CurationDescription