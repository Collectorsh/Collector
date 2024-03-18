import { useRouter } from "next/router"
import { hideCuration } from "../../data/curation/hideCuration"
import MainButton, { WarningButton } from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"
import { useContext, useState } from "react"
import UserContext from "../../contexts/user"
import { error, success } from "../../utils/toast"
import { Oval } from "react-loader-spinner"

const DeleteConfirmationModal = ({ isOpen, onClose, name, onDelete }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => { 
   
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) onClose()
  }

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={`Deleting ${ name.replaceAll("_", " ") }`}
      widthClass="max-w-screen-sm"
    >
      <div className="flex flex-col gap-3 pt-4 text-center items-center justify-center min-h-[9rem]">
        <p className="text-xl font-bold">Are you sure?</p>
        <p className="textPalette2">Once deleted you will not be able to access this curation again</p>
      </div>
      <div className={modalActionDivClass}>
        <MainButton onClick={onClose} size="lg" className="w-28">
          Cancel
        </MainButton>
        <WarningButton onClick={handleDelete} solid size="lg" className="w-28 flex justify-center items-center" disabled={deleting}>
          {deleting
            ? <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} />
            : "Delete"
          }
        </WarningButton>
      </div>
    </Modal>
  )

}

export default DeleteConfirmationModal