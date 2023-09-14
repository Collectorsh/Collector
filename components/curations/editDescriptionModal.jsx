import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { QuillEditor } from "../Quill"

const EditDescriptionModal = ({ description, onSave, isOpen, onClose }) => {
  const [newDescription, setNewDescription] = useState(description || "")

  const handleSave = () => {
    onSave(newDescription)
    onClose()
  }

  const onChange = (newDelta) => { 
    setNewDescription(newDelta)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit The Gallery Description">
      {/* <textarea
        className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-80 sm:h-56 p-3 text-center
        "
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
      /> */}
      <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor textDelta={newDescription} onChange={onChange} />
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

export default EditDescriptionModal