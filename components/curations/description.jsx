import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'
import dynamic from 'next/dynamic';

const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const CurationDescription = ({ description, displayDraftEdit, setEditDescriptionOpen }) => { 
  return (
    <div className="group/description w-full mx-auto px-4">
      <EditWrapper
        isOwner={displayDraftEdit}
        onEdit={() => setEditDescriptionOpen(true)}
        placement="outside-tr"
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