import { useState } from "react"
import MainButton from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"


const EditDisplayNameModal = ({ name, onSave, isOpen, onClose }) => {
  const [newName, setNewName] = useState(name || "")

  const handleSave = async () => {
    await onSave(newName)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editing Display Name"
      widthClass="max-w-screen-sm"
    >
      <input
        className="mt-3 sm:mt-6 border-2 rounded-lg
        bg-neutral-200 dark:bg-neutral-900 borderPalette3 outline-none
        w-full px-4 py-2"
        onChange={(e) => setNewName(e.target.value.replaceAll(" ", "_"))}
        value={newName}
      />
  
      <div className={modalActionDivClass}>
        <MainButton onClick={onClose} size="lg" standardWidth>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid size="lg" standardWidth>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditDisplayNameModal