import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { useRouter } from "next/router"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import { InformationCircleIcon } from "@heroicons/react/solid"
import { useEditName } from "../proGallery/editNameModal"

const decimalRegex = /^\d+(\.\d+)?$/;
export const urlRegex = /^[a-zA-Z0-9_-]{2,64}$/; 

const CreateGalleryModal = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { newName: galleryName, nameError, nameValid, setNewName } = useEditName("")

  const [curatorFee, setCuratorFee] = useState(undefined)
  const [curatorFeeError, setCuratorFeeError] = useState(null)
  const [galleryBanner, setGalleryBanner] = useState(undefined)
  const [galleryDescription, setGalleryDescription] = useState('')

  const feeValid = decimalRegex.test(curatorFee) && !curatorFeeError
  const galleryValid = nameValid && feeValid

  useEffect(() => { 
    if (curatorFee === undefined) return;
    const isNotNumber = !decimalRegex.test(curatorFee)
    if (isNotNumber || curatorFee < 0 || curatorFee > 50) setCuratorFeeError("Curator Fee must be between 0% and 50%")
    else setCuratorFeeError(null)
  },[curatorFee])

  const handleCreate = async () => {
    //TODO: await send to DB and make new gallery

    router.push(`/pro/${galleryName}`)
  }

  const handleClose = () => { 
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen} onClose={handleClose}
      title="Create New Pro Gallery"
      widthClass="max-w-lg"
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
          onChange={(e) => setNewName(e.target.value.replace(" ", "_"))}
          value={galleryName}
        />
        <p className="text-sm pl-4 italic text-red-500 h-4">{nameError}</p>
      </div>

      <div>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Curator Fee* <i className="text-sm">(you cannot change this after the fact)</i>:</p>
          <Tippy
            content="Keep in mind, Collector also takes a 5% platform fee. Max curator fee is 50%."
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