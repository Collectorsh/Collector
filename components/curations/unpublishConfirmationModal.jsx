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
        <WarningButton onClick={handleUnpublish} solid size="lg" className="w-[8.75rem]">
          Unpublish
        </WarningButton>
      </div>
    </Modal>
  )

}

export default UnpublishConfirmationModal