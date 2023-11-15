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
      isOpen={isOpen} onClose={onClose} title="Edit Text Module">
      <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-2 min-h-[8rem]
        ">
        <QuillEditor
          textDelta={newTextModule.textDelta}
          onChange={onChange}
        />
      </div>

      <div className="w-full flex justify-center md:justify-between items-center gap-4 mt-4 flex-wrap">
        <WarningButton onClick={onDeleteModule}>
          Delete Module
        </WarningButton>
        <div className="flex gap-4">
          <MainButton onClick={handleClose}>
            Cancel
          </MainButton>
          <MainButton onClick={handleSave} solid>
            Save
          </MainButton>
        </div>
      </div>
    </Modal>
  )

}

export default EditTextModuleModal