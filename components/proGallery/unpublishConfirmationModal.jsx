import { useState } from "react"
import MainButton, { WarningButton } from "../MainButton"
import Modal from "../Modal"

const UnpublishConfirmationModal = ({ onUnpublish, isOpen, onClose, name }) => {
  const handleUnpublish = () => {
    onUnpublish()
    onClose()
  }
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={`Unpublish ${ name.replaceAll("_", " ") }`}
    >
      <div className="flex flex-col gap-3 py-6 items-center justify-center h-32">
        <p className="text-xl font-bold">Are you sure?</p>
        <p>Unpublishing {name.replaceAll("_", " ")} means no one will be able to view it.</p>
      </div>
      <div className="w-full flex justify-center flex-wrap gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <WarningButton onClick={handleUnpublish} solid>
          Unpublish
        </WarningButton>
      </div>
    </Modal>
  )

}

export default UnpublishConfirmationModal