import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { hd } from "@cloudinary/url-gen/qualifiers/streamingProfile"

const EditBioModal = ({ bio, onSave, isOpen, onClose }) => { 
  const [currentBio, setCurrentBio] = useState(bio)

  const handleEnter = (e) => {
    //will need to figure out some way to handle new lines before using this ("shift + enter"?)
    // if (e.key !== "Enter" || !isOpen) return
    // onSave(currentBio)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Bio">
      <textarea
        onKeyDown={handleEnter}
        className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full h-80 sm:h-56 p-3
        "
        onChange={(e) => setCurrentBio(e.target.value)}
        value={currentBio}
      />
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <MainButton onClick={() => onSave(currentBio)} solid>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditBioModal