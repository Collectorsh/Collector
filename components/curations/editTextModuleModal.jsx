import React, { useState } from "react"
import MainButton, { WarningButton } from "../MainButton"
import Modal from "../Modal"

import dynamic from "next/dynamic"
const QuillEditor = dynamic(() => import("../Quill").then(mod => mod.QuillEditor), { ssr: false })

const EditTextModuleModal = ({ textModule, onEditTextModule, isOpen, onClose, onDeleteModule }) => {
  const [newTextModule, setNewTextModule] = useState(textModule)
  
  const handleSave = () => {
    onEditTextModule(newTextModule)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const onChange = (newDelta) => { 
    setNewTextModule(prev => ({
      ...prev,
      textDelta: newDelta
    }))
  }

  return (
    <Modal
      className="overflow-visible"
      isOpen={isOpen} onClose={onClose} title="Editing Text">
      <div className="mt-3 sm:mt-6 border-2 rounded-xl bg-neutral-200 dark:bg-neutral-900 borderPalette3
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor
          textDelta={newTextModule.textDelta}
          onChange={onChange}
        />
      </div>

      <div className="w-full flex justify-center md:justify-between items-center gap-4 sm:gap-8 mt-6 sm:mt-8">
        <WarningButton onClick={onDeleteModule} size="lg">
          Delete
        </WarningButton>
        <div className="flex gap-4">
          <MainButton onClick={handleClose} size="lg" standardWidth>
            Cancel
          </MainButton>
          <MainButton onClick={handleSave} solid size="lg" standardWidth>
            Save
          </MainButton>
        </div>
      </div>
    </Modal>
  )

}

export default EditTextModuleModal