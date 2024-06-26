import { useContext, useState } from "react"
import MainButton from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"
import CopyButton from "../CopyToClipboard"
import { shootConfetti } from "../../utils/confetti"
import { useRouter } from "next/router"
import UserContext from "../../contexts/user"

const PublishConfirmationModal = ({ isOpen, onClose, name, onPublish, onViewPublished, isPublished }) => {
  const [saving, setSaving] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [error, setError] = useState(false)

  const router = useRouter()
  const [user, setUser] = useContext(UserContext);

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

  // const handleViewPublished = () => { 
  //   onViewPublished()
  //   handleClose()
  // }

  const handleGallery = () => { 
    router.push(`/${user.username}`)

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
    if (saving) return <p className="animate-pulse">Publishing...</p>
    if (error) return <p>Oops, looks like something went wrong. Try again in a few seconds!</p>
    if (publishSuccess) return (
      <>
        <p className="text-xl font-bold">Congrats, {name.replaceAll("_", " ")} is now live!</p>
        <div className="flex gap-2 items-center justify-center flex-wrap">
          <p className="font-bold textPalette2">{getUrl()}</p>
          <CopyButton textToCopy={getUrl()} />
        </div>
      </>
    )
    if(isPublished) return (
      <>
        <p className="text-xl font-bold">Are you sure?</p>
        <p className="textPalette2">Publishing this draft of {name.replaceAll("_", " ")} will overwrite the currently published version.</p>
      </>
    )
    return (
      <>
        <p className="text-xl font-bold">Are you sure?</p>
        <p className="textPalette2">Publishing this draft of {name.replaceAll("_", " ")} will make it viewable by everyone.</p>
      </>
    )
  }
  const getButtons = () => {
    if (publishSuccess) return (
      <>
        <MainButton onClick={handleClose} className="w-[12.2rem]" size="lg">
          Continue Editing
        </MainButton>
        <MainButton onClick={handleGallery} className="w-[12.2rem]"  solid  size="lg">
          View Gallery
        </MainButton>
      </>
    )
    else return (
      <>
        <MainButton onClick={handleClose} size="lg" className="w-[7.63rem]">
          Cancel
        </MainButton>
        <MainButton onClick={handlePublish} solid disabled={saving}  size="lg" className="w-[7.63rem]">
          Publish!
        </MainButton>
      </>
    )
  }



  return (
    <Modal isOpen={isOpen} onClose={handleClose}
      title={`Publishing ${ name.replaceAll("_", " ") }`}
      widthClass="max-w-screen-sm"
    >
      <div className="flex flex-col gap-3 pt-4 text-center items-center justify-center min-h-[9rem]">
        { getContent()}
      </div>
      <div className={modalActionDivClass}>
        { getButtons()}
      </div>
    </Modal>
  )
}

export default PublishConfirmationModal