import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { checkCurationNameAvailability } from "../../data/curation/updateCurationName";

const urlRegex = /^(?!.*[_-]{2})[a-zA-Z0-9_-]{2,31}$/;

const DEBOUNCE_TIME = 500;

export const useEditName = (name) => { 
  const [newName, setNewName] = useState(name || "")
  const [nameError, setNameError] = useState(null)

  const nameValid = newName?.length >= 2 && newName && !nameError 

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (newName?.length < 2) return; //don't set an error when they are beginning to type
    const isUrlValid = urlRegex.test(newName);

    if (!isUrlValid) setNameError('Must be 2 to 31 characters and only contain letters, numbers, "_" and "-"');

    // Set a new timeout to execute the logic after 500ms
    const newTimeout = setTimeout(async () => {
      const availabilityRes = await checkCurationNameAvailability(newName);
      const isUnique = availabilityRes.status === "success";

      if (!isUnique) setNameError("Sorry this curation name is already taken");
      if (isUrlValid && isUnique) setNameError(null);
    }, DEBOUNCE_TIME);

    // Save the new timeout ID to state
    setDebounceTimeout(newTimeout);

    // Cleanup function to clear the timeout when the component is unmounted
    return () => {
      clearTimeout(newTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newName]);

  return {newName, nameError, nameValid, setNewName}
}

const EditNameModal = ({ name, onSave, isOpen, onClose }) => {
  const {newName, nameError, nameValid, setNewName} = useEditName(name)

  const handleSave = () => {
    onSave(newName)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Curation Name"
      widthClass="max-w-screen-sm"
    >
      <p className="pl-2 mt-6 text-center">Please note, changing the name here will change the published curation&apos;s url.</p>
      <input
        className="my-4 border-4 rounded-xl
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        w-full p-3"
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