import { Oval } from "react-loader-spinner"
import MainButton, { WarningButton } from "../MainButton"
import Modal from "../Modal"
import { useState } from "react"

const UnpublishConfirmationModal = ({ onUnpublish, isOpen, onClose, name }) => {
  const [unpublishing, setUnpublishing] = useState(false)

  const handleUnpublish = async () => {
    setUnpublishing(true)
    const success = await onUnpublish()
    setUnpublishing(false)
    if (success) onClose()
  }
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={`Unpublishing ${ name.replaceAll("_", " ") }`}
      widthClass="max-w-screen-sm"
    >
      <div className="flex flex-col gap-3 pb-10 pt-6 text-center items-center justify-center min-h-[9rem]">
        <p className="text-xl font-bold">Are you sure?</p>
        <p className="textPalette2">Unpublishing {name.replaceAll("_", " ")} means no one will be able to view it.</p>
      </div>
      <div className="w-full flex justify-center flex-wrap gap-4">
        <MainButton onClick={onClose} size="lg" className="w-[8.75rem]">
          Cancel
        </MainButton>
        <WarningButton onClick={handleUnpublish} solid size="lg" className="w-[8.75rem] flex justify-center items-center">
          {unpublishing
            ? <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} />
            : "Unpublish"
          }

        </WarningButton>
      </div>
    </Modal>
  )

}

export default UnpublishConfirmationModal