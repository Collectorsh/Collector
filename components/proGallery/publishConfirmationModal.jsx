import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import CopyButton from "../CopyToClipboard"
import { shootConfetti } from "../../utils/confetti"

const PublishConfirmationModal = ({ isOpen, onClose, name, onPublish, onViewPublished, isPublished }) => {
  const [saving, setSaving] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [error, setError] = useState(false)

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href//.split("//")[1]
    } else return ""
  }

  const handlePublish = async () => {
    setSaving(true)
    setError(false)
    try {
      const success = await onPublish()
      if (success) {
        shootConfetti(3)
        setPublishSuccess(true)
      } else setError(true)
    } catch (e) {
      console.log("Error publishing draft:", e)
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  const handleViewPublished = () => { 
    onViewPublished()
    handleClose()
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSaving(false)
      setPublishSuccess(false)
      setError(false)
    },300)
  }

  const getContent = () => {
    if (saving) return <p className="animate-pulse">Saving...</p>
    if (error) return <p>Oops, looks like something went wrong. Try again in a few seconds!</p>
    if (publishSuccess) return (
      <>
        <p className="text-xl font-bold">Congrats, {name.replaceAll("_", " ")} is now live!</p>
        <div className="flex gap-2 items-center justify-center flex-wrap">
          <p className="underline font-bold">{getUrl()}</p>
          <CopyButton textToCopy={getUrl()} />
        </div>
      </>
    )
    if(isPublished) return (
      <>
        <p className="text-xl font-bold">Are you sure?</p>
        <p>Publishing this draft of {name.replaceAll("_", " ")} will overwrite the currently published version.</p>
      </>
    )
    return (
      <>
        <p className="text-xl font-bold">Are you sure?</p>
        <p>Publishing this draft of {name.replaceAll("_", " ")} means anyone will be able to view it.</p>
      </>
    )
  }
  const getButtons = () => {
    if (publishSuccess) return (
      <>
        <MainButton onClick={handleClose}>
          Continue Editing
        </MainButton>
        <MainButton onClick={handleViewPublished} solid>
          View Published
        </MainButton>
      </>
    )
    else return (
      <>
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handlePublish} solid disabled={saving}>
          Publish!
        </MainButton>
      </>
    )
  }



  return (
    <Modal isOpen={isOpen} onClose={handleClose}
      title={`Publish ${ name.replaceAll("_", " ") }`}
    >
      <div className="flex flex-col gap-3 py-6 items-center justify-center h-32">
        { getContent()}
      </div>
      <div className="w-full flex justify-center flex-wrap gap-4">
        { getButtons()}
      </div>
    </Modal>
  )
}

export default PublishConfirmationModal