import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { urlRegex } from "../curatorProfile/createGalleryModal"

export const useEditName = (name) => { 
  const [newName, setNewName] = useState(name || "")
  const [nameError, setNameError] = useState(null)

  const nameValid = newName?.length >= 3 && newName && !nameError 

  useEffect(() => {
    if (newName?.length <= 2) return;

    const isUrlValid = urlRegex.test(newName)

    const isUnique = true // TODO: check if gallery name is unique

    if (!isUnique) setNameError("Sorry this gallery name is already taken")
    if (!isUrlValid) setNameError('Must be 3-64 characters and only contain letters, numbers, "_" and "-"')
    if (isUrlValid && isUnique) setNameError(null)
  }, [newName])

  return {newName, nameError, nameValid, setNewName}
}

const EditNameModal = ({ name, onSave, isOpen, onClose }) => {
  const {newName, nameError, nameValid, setNewName} = useEditName(name)

  const handleSave = () => {
    onSave(newName)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Gallery Name">
      <p className="font-bold text-yellow-500 pl-2 mt-6 text-center">Please note, changing the gallery name will also change this gallery&apos;s url.</p>
      <input
        className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-3
        "
        onChange={(e) => setNewName(e.target.value.replaceAll(" ", "_"))}
        value={newName}
      />
      <p className="text-sm pl-4 italic text-red-500 h-4">{nameError}</p>
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid disabled={!nameValid}>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditNameModal