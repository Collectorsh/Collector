import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"


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
      {/* <p className="textPalette2 text-sm my-2 text-center">Changes</p> */}
      <input
        className="my-1 border-2 rounded-lg
        palette2 borderPalette3 outline-none
        w-full px-4 py-2"
        onChange={(e) => setNewName(e.target.value.replaceAll(" ", "_"))}
        value={newName}
      />
  
      <div className="w-full flex justify-center gap-4 mt-4">
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