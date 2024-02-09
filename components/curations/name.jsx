import EditWrapper from "../curatorProfile/editWrapper"
import * as Icon from 'react-feather'

const CurationName = ({ name, displayPublishedEdit, setEditNameOpen }) => { 
  return (
    <div className="group/name mb-3 px-4 mx-auto w-full">
      <EditWrapper
        isOwner={displayPublishedEdit}
        onEdit={() => setEditNameOpen(true)}
        placement="outside-tr"
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