import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { useRouter } from "next/router"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import { InformationCircleIcon } from "@heroicons/react/solid"

const decimalRegex = /^\d+(\.\d+)?$/;


const CreateGalleryModal = ({ isOpen, onClose }) => {
  const router = useRouter()
  const [galleryName, setGalleryName] = useState('')
  const [galleryNameError, setGalleryNameError] = useState(null)
  const [galleryDescription, setGalleryDescription] = useState('')
  const [curatorFee, setCuratorFee] = useState(undefined)
  console.log("🚀 ~ file: createGalleryModal.jsx:15 ~ CreateGalleryModal ~ curatorFee:", curatorFee)
  const [curatorFeeError, setCuratorFeeError] = useState(null)
  const [galleryBanner, setGalleryBanner] = useState(undefined)

  const nameValid = galleryName?.length >= 3 && galleryName && !galleryNameError 
  const feeValid = decimalRegex.test(curatorFee) && !curatorFeeError
  const galleryValid = nameValid && feeValid

  useEffect(() => {
    if (galleryName?.length <= 2) return;

    const urlRegex = /^[a-zA-Z0-9_-]{2,64}$/; 
    const isUrlValid = urlRegex.test(galleryName)

    const isUnique = true // TODO: check if gallery name is unique

    if (!isUnique) setGalleryNameError("Sorry this gallery name is already taken")
    if (!isUrlValid) setGalleryNameError("Gallery Name must be 3-64 characters and can only contain letters, numbers, underscores, and dashes") 
    if (isUrlValid && isUnique) setGalleryNameError(null)
  }, [galleryName])

  useEffect(() => { 
    if (curatorFee === undefined) return;
    const isNotNumber = !decimalRegex.test(curatorFee)
    if (isNotNumber || curatorFee < 0 || curatorFee > 50) setCuratorFeeError("Curator Fee must be between 0% and 50%")
    else setCuratorFeeError(null)
  },[curatorFee])

  const handleCreate= () => {
    onSave(newBio)
    onClose()
  }

  const handleClose = () => { 
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen} onClose={handleClose}
      title="Create New Pro Gallery"
      widthClass="max-w-3xl"
    >
      <div>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Gallery Name*:</p>
          <Tippy
            content="This will be your gallery's URL path."
            className="shadow-lg"
          >
            <InformationCircleIcon className="w-4"/>
          </Tippy>
        </div>
        <input
          type="text"
          className="w-full border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900"
          placeholder="Gallery Name"
          onChange={(e) => setGalleryName(e.target.value)}
          value={galleryName}
        />
        <p className="text-sm pl-4 italic text-red-500 h-4">{galleryNameError}</p>
      </div>

      <div>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Curator Fee* <i className="text-sm">(you cannot change this after the fact)</i>:</p>
          <Tippy
            content="Keep in mind Collector takes a 5% platform fee as well. Max curator fee is 50%."
            className="shadow-lg"
          >
            <InformationCircleIcon className="w-4" />
          </Tippy>
        </div>
        <div className="flex w-full border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
          <input
            type="number"
            step={0.1}
            min={0}
            max={50}
            className="outline-none bg-transparent w-full"
            placeholder="Curation Fee"
            onChange={(e) => setCuratorFee(e.target.value)}
            value={curatorFee}
          />
          <p>%</p>
        </div>
        <p className="text-sm mb-2 pl-4 italic text-red-500 h-4">{curatorFeeError}</p>
      </div>

      {/* <p>Gallery banner placeholder</p>

      <p className="font-bold mb-1">Gallery Description:</p>
      <textarea
        className="mb-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-28 p-3
        "
        placeholder="Tell us about your gallery!"
        onChange={(e) => setGalleryDescription(e.target.value)}
        value={galleryDescription}
      /> */}
      <p className="italic text-sm">* Required</p>
    
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleCreate} solid disabled={!galleryValid}>
          Create Gallery!
        </MainButton>
      </div>
    </Modal>
  )

}

export default CreateGalleryModal