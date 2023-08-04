import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"

const EditBioModal = ({ bio, onSave, isOpen, onClose }) => { 
  const [newBio, setNewBio] = useState(bio || "")

  const handleSave = () => { 
    onSave(newBio)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Bio">
      <textarea
        className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-80 sm:h-56 p-3
        "
        onChange={(e) => setNewBio(e.target.value)}
        value={newBio}
      />
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditBioModal