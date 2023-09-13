import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { QuillEditor } from "../curations/editTextModuleModal"

const EditBioModal = ({ bio, onSave, isOpen, onClose }) => { 
  const [newBio, setNewBio] = useState(bio || "{}")

  const handleSave = () => { 
    onSave(newBio)
    onClose()
  }

  const onChange = (newDelta) => {
    setNewBio(newDelta)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Bio">
      <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor
          textDelta={newBio}
          onChange={onChange}
        />
      </div>
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