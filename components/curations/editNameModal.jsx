import { useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"
import { checkCurationNameAvailability } from "../../data/curation/updateCurationName";

// export const urlRegex = /^(?!.*[_-]{2})[a-zA-Z0-9_-]{2,31}$/; //allows _ and - begin and end
// export const urlRegex = /^(?!.*[_-]{2})(?![_-])[a-zA-Z0-9_-]{1,29}(?<![_-])$/; // not compatable with safari
export const urlRegex = /^(?![_-])(?!.*[_-]{2})[a-zA-Z0-9_-]+[^_-]$/


const DEBOUNCE_TIME = 500;

export const useEditName = (name, curatorId) => { 
  const [newName, setNewName] = useState(name || "")
  const [nameError, setNameError] = useState(null)

  const nameValid = newName?.length >= 2 && newName && !nameError 

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (newName === name) {
      setNameError(null);
      return;
    }
    // Clear the previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (newName?.length < 2) return; //don't set an error when they are beginning to type
    const isUrlValid = urlRegex.test(newName);

    if (!isUrlValid) setNameError('Must be 2 to 31 characters and only contain letters, numbers, "_" and "-"');

    // Set a new timeout to execute the logic after 500ms
    const newTimeout = setTimeout(async () => {
      const availabilityRes = await checkCurationNameAvailability(newName, curatorId);
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

const EditNameModal = ({ name, curatorId, onSave, isOpen, onClose }) => {
  const {newName, nameError, nameValid, setNewName} = useEditName(name, curatorId)

  const handleSave = () => {
    onSave(newName)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editing Curation Name"
      widthClass="max-w-screen-sm"
    >
      <p className="textPalette2 text-sm mt-4 text-center mb-2">Please note: changing the name here will change the published curation&apos;s url.</p>
      <input
        className="border-2 rounded-lg
      bg-neutral-200 dark:bg-neutral-900 borderPalette3 outline-none
        w-full px-4 py-2"
        onChange={(e) => setNewName(e.target.value.replaceAll(" ", "_"))}
        value={newName}
      />
      <p className="text-sm pl-4 text-red-500 h-0">{nameError}</p>
      <div className={modalActionDivClass}>
        <MainButton onClick={onClose} size="lg" standardWidth>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid disabled={!nameValid} size="lg" standardWidth>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditNameModal