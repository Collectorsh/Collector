import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"

import dynamic from 'next/dynamic';
const QuillEditor= dynamic(() => import('../Quill').then(mod => mod.QuillEditor), { ssr: false })

const EditDescriptionModal = ({ description, onSave, isOpen, onClose }) => {
  const [newDescription, setNewDescription] = useState(description || "")

  const handleSave = () => {
    onSave(newDescription)
    onClose()
  }

  const onChange = (newDelta) => { 
    setNewDescription(newDelta)
  }

  useEffect(() => {
    // needs to reset when switching from published to draft
    setNewDescription(description)
  }, [description])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit The Gallery Description">
      <div className="my-4 border-2 rounded-xl palette2 borderPalette3
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor textDelta={newDescription} onChange={onChange} />
      </div>
      <div className="w-full flex justify-center gap-4">
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

export default EditDescriptionModal