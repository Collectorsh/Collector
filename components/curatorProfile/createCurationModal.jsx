import { useContext, useEffect, useMemo, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { useRouter } from "next/router"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import { InformationCircleIcon } from "@heroicons/react/solid"
import { useEditName } from "../curations/editNameModal"
import createCuration, { createPersonalCuration } from "../../data/curation/createCuration"
import { MAX_CURATOR_FEE_POINTS } from "../../pages/api/curations/createCuration"
import UserContext from "../../contexts/user"
import { error, success } from "../../utils/toast"
import { shootConfetti } from "../../utils/confetti"
import { Switch } from "@headlessui/react"
import clsx from "clsx"
import { PLATFORM_AUCTION_HOUSE_1_ADDRESS } from "../../config/settings"

const decimalRegex = /^\d+(\.\d+)?$/;

const maxCuratorFee = MAX_CURATOR_FEE_POINTS / 100;

const curationTypes = ["collector", "artist", "curator"]

const CreateCurationModal = ({ isOpen, onClose }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const { newName: curationName, nameError, nameValid, setNewName } = useEditName("")

  const [curatorFee, setCuratorFee] = useState(undefined)
  const [curatorFeeError, setCuratorFeeError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [curationType, setCurationType] = useState(curationTypes[0])

  const typeChecked = curationType === "artist"

  const feeValid = decimalRegex.test(curatorFee) && !curatorFeeError
  const curationValid = curationType === "curator"
    ? nameValid && feeValid
    : nameValid

  useEffect(() => { 
    if (curatorFee === undefined) return;
    const isNotNumber = !decimalRegex.test(curatorFee)
    if (isNotNumber || curatorFee < 0 || curatorFee > maxCuratorFee) setCuratorFeeError(`Curator Fee must be between 0% and ${maxCuratorFee}%`)
    else setCuratorFeeError(null)
  },[curatorFee])

  const handleCreate = async () => {
    if (!curationValid) return;
    setCreating(true)

    let res;
    if (curationType === "curator") { 
      res = await createCuration({
        curationName: curationName,
        curatorFee: curatorFee,
        apiKey: user.api_key,
        curatorWithdrawalPubkey: user.public_keys[0]
      })
    } else {
      res = await createPersonalCuration({
        curationName: curationName,
        apiKey: user.api_key,
        curationType: curationType,
        auctionHouseAddress: PLATFORM_AUCTION_HOUSE_1_ADDRESS
      })
    }

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
      <p className="font-bold mt-2">Curation Type</p>
      {curationTypes.map((type) => {
        return (
          <CurationTypeButton
            key={type}
            type={type}
            selected={curationType === type}
            onChange={setCurationType}
          />
        )
      })}

      <hr className="my-3 border-neutral-200 dark:border-neutral-700" />

      <div>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Curation Name*</p>
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
          placeholder="Curation Name"
          onChange={(e) => setNewName(e.target.value.replace(" ", "_"))}
          value={curationName}
        />
        <p className="text-sm pl-4 italic text-red-500 h-4">{nameError}</p>
      </div>

      <div className={curationType !== "curator" && "hidden"}>
        <div className="relative flex items-center gap-1 mb-1">
          <p className="font-bold">Curator Fee* <i className="text-sm">(Cannot be changed later)</i>:</p>
          <Tippy
            content="Percentage of sales allocated to the curator, in addition to Collector's 5% platform fee."
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
        <p className="text-sm pl-4 italic text-red-500 h-4">{curatorFeeError}</p>
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
          {curationType === "curator" ? <p className="text-center italic">This process includes several on chain transactions and could take a few minutes.</p> : null}
        </div>)
        : form
      }
    
      <div className="w-full flex justify-center gap-4">
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

const CurationTypeButton = ({ type, selected, onChange }) => {
  const handleClick = () => {
    onChange(type)
  }
  const description = useMemo(() => { 
    switch (type) {
      case "curator":
        return "Showcase artwork from a variety of artists"
      case "artist":
        return "Showcase artworks you have created"
      case "collector":
        return "Showcase artworks you have collected"
    }
  },[type])
  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex gap-2 items-center",
        "rounded-lg px-4 py-2 my-2",
        "ring-neutral-100 dark:ring-neutral-900 bg-neutral-200 dark:bg-neutral-700",
        "hover:scale-[102%] hover:opacity-100 duration-300 active:scale-100",
        selected ? "ring-4 ring-primary-500 dark:ring-primary-400" : "opacity-50"

      )}
    >
      <p className="capitalize font-bold text-lg text-left">{type}:</p>
      <p className="text-sm text-left">{ description}</p>
    </button>
  )
}