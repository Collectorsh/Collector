import { useState } from "react"
import MainButton from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"

import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../Quill').then(mod => mod.QuillEditor), { ssr: false })



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
    <Modal isOpen={isOpen} onClose={onClose} title="Editing Bio">
      <div className="mt-3 sm:mt-6 border-4 bg-neutral-200 dark:bg-neutral-900 borderPalette3 rounded-xl
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor
          textDelta={newBio}
          onChange={onChange}
        />
      </div>
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

export default EditBioModal