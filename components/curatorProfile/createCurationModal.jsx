import { useContext, useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { useRouter } from "next/router"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import { InformationCircleIcon } from "@heroicons/react/solid"
import { useEditName } from "../curations/editNameModal"
import createCuration from "../../data/curation/createCuration"
import { MAX_CURATOR_FEE_POINTS } from "../../pages/api/curations/createCuration"
import UserContext from "../../contexts/user"
import { error, success } from "../../utils/toast"
import { shootConfetti } from "../../utils/confetti"

const decimalRegex = /^\d+(\.\d+)?$/;

const maxCuratorFee = MAX_CURATOR_FEE_POINTS / 100;

const CreateCurationModal = ({ isOpen, onClose }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const { newName: curationName, nameError, nameValid, setNewName } = useEditName("")

  const [curatorFee, setCuratorFee] = useState(undefined)
  const [curatorFeeError, setCuratorFeeError] = useState(null)
  const [creating, setCreating] = useState(false)

  const feeValid = decimalRegex.test(curatorFee) && !curatorFeeError
  const curationValid = nameValid && feeValid

  useEffect(() => { 
    if (curatorFee === undefined) return;
    const isNotNumber = !decimalRegex.test(curatorFee)
    if (isNotNumber || curatorFee < 0 || curatorFee > maxCuratorFee) setCuratorFeeError(`Curator Fee must be between 0% and ${maxCuratorFee}%`)
    else setCuratorFeeError(null)
  },[curatorFee])

  const handleCreate = async () => {
    if (!curationValid) return;
    setCreating(true)

    const res = await createCuration({
      curationName: curationName,
      curatorFee: curatorFee,
      apiKey: user.api_key,
      curatorWithdrawalPubkey: user.public_keys[0]
    })

    if (res?.status === "success") {
      success(`${ curationName } has been created!`)
      shootConfetti(3)
      router.push(`/curations/${curationName}`)
    } else {
      error(`${ curationName } creation failed`)
      setCreating(false)
    }
  }

  const handleClose = () => { 
    onClose();
  }

  const form = (
    <>
      <div>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Curation Name*:</p>
          <Tippy
            content="This will be your curation's URL path."
            className="shadow-lg"
          >
            <InformationCircleIcon className="w-4" />
          </Tippy>
        </div>
        <input
          type="text"
          className="w-full border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900"
          placeholder="curation Name"
          onChange={(e) => setNewName(e.target.value.replace(" ", "_"))}
          value={curationName}
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

      <p className="italic text-sm">* Required</p>
    </>
  )

  return (
    <Modal
      isOpen={isOpen} onClose={handleClose}
      title="Create New Curation"
      widthClass="max-w-lg"
    >
      
      {creating
        ? (<div className="flex flex-col justify-center items-center gap-4 h-36">
          <p className="text-xl font-bold animate-pulse">Building {curationName}...</p>
          <p className="text-center italic">This process includes several on chain transactions and could take a few minutes.</p>
        </div>)
        : form
      }
    
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={handleClose} disabled={creating}>
          Cancel
        </MainButton>
        <MainButton onClick={handleCreate} solid disabled={!curationValid || creating}>
          Create Curation!
        </MainButton>
      </div>
    </Modal>
  )

}

export default CreateCurationModal