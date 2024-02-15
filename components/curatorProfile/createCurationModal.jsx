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
import clsx from "clsx"
import { PLATFORM_AUCTION_HOUSE_1_ADDRESS } from "../../config/settings"

const decimalRegex = /^\d+(\.\d+)?$/;

const maxCuratorFee = MAX_CURATOR_FEE_POINTS / 100;

const curationTypes = [
  "collector",
  "artist",
  "curator"
]

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
      <p className="font-bold my-2 text-xl text-center">Curation Type</p>
      <div className="grid sm:grid-cols-3 gap-4">
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

      </div>

      <hr className="my-5 borderPalette3" />

      <div className="px-4">
        <div>
          <div className="relative mb-1">
            <p className="font-bold">Curation Name</p>
            <p className="text-xs textPalette2">Also your curation&apos;s url (e.g. https://collector.sh/curations/curation_name)</p>
          </div>
          <input
            type="text"
            className="w-full border-2 px-3 py-2 rounded-lg palette2 borderPalette3 outline-none"
            placeholder="Curation Name"
            onChange={(e) => setNewName(e.target.value.replace(" ", "_"))}
            value={curationName}
          />
          <p className="text-sm pl-4 italic text-red-500 h-4">{nameError}</p>
        </div>

        <div className={curationType !== "curator" && "hidden"}>
          <div className="relative mb-1">
            <p className="font-bold">Curator Fee</p>
            <p className="text-xs textPalette2">Percentage of sales allocated to you as the curator (we recommend around 10%)</p>
          </div>
          <div className="flex w-full border-2 px-3 py-2 rounded-lg palette2 borderPalette3">
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
          <p className="text-xs textPalette3 ml-3.5">This number cannot be changed later</p>
          <p className="text-sm pl-4 italic text-red-500 h-5">{curatorFeeError}</p>
        </div>

      </div>
    </>
  )

  return (
    <Modal
      isOpen={isOpen} onClose={handleClose}
      title="Create New Curation"
      widthClass="max-w-2xl"
    >
      
      {creating
        ? (<div className="flex flex-col justify-center items-center gap-4 h-36">
          <p className="text-xl font-bold animate-pulse">Building {curationName}...</p>
          {curationType === "curator" ? <p className="text-center italic">This process includes several on chain transactions and could take a few minutes.</p> : null}
        </div>)
        : form
      }
    
      <div className="w-full flex justify-center gap-4 mt-4">
        <MainButton onClick={handleClose} disabled={creating} size="lg" className="w-[12.13rem]">
          Cancel
        </MainButton>
        <MainButton onClick={handleCreate} solid disabled={!curationValid || creating} size="lg" className="w-[12.13rem]">
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

  const title = type === "curator" ? "Group" : type

  const description = useMemo(() => { 
    switch (type) {
      case "curator":
        return "Showcase artwork from a variety of artists"
      case "artist":
        return "Showcase artworks you have created"
      case "collector":
        return "Showcase artworks you have collected"
    }
  }, [type])
  
  const icon = useMemo(() => {
    switch (type) {
      case "curator":
        return <GroupIcon />
      case "artist":
        return <ArtistIcon />  
      case "collector":
        return <CollectorIcon />
    }
  }, [type])
  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex flex-col gap-2 items-start",
        "rounded-lg px-4 py-2",
        "ring-zinc-300 dark:ring-zinc-700 palette2",
        "hover:opacity-100 duration-300",
        selected ? "ring-4" : "opacity-50"

      )}
    >
      <div className="flex justify-between w-full">
        <p className="capitalize font-bold text-lg text-left">{title}</p>
        {icon}
      </div>

      <p className="text-sm text-left">{ description}</p>
    </button>
  )
}

export const CollectorIcon = ({className = "w-6 h-6"}) => { 
  return (
    <svg
      className={clsx("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g id="Museum-Painting--Streamline-Ultimate.svg"><path d="M22 0H2a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h20a2 2 0 0 0 2 -2V2a2 2 0 0 0 -2 -2Zm0 10.5a0.5 0.5 0 0 1 -0.5 0.5h-19a0.5 0.5 0 0 1 -0.5 -0.5v-8a0.5 0.5 0 0 1 0.5 -0.5h19a0.5 0.5 0 0 1 0.5 0.5Z" ></path><path d="M17.54 4.53a0.55 0.55 0 0 0 -0.45 -0.28 0.55 0.55 0 0 0 -0.48 0.24l-2.4 3.61a0.5 0.5 0 0 1 -0.4 0.24 0.52 0.52 0 0 1 -0.43 -0.15l-1.84 -1.85a0.6 0.6 0 0 0 -0.41 -0.16 0.58 0.58 0 0 0 -0.39 0.19L8.63 8.85a0.55 0.55 0 0 0 0.41 0.9h10.42a0.52 0.52 0 0 0 0.46 -0.27 0.52 0.52 0 0 0 0 -0.54Z" ></path><path d="M4.5 5A1.75 1.75 0 1 0 8 5a1.75 1.75 0 1 0 -3.5 0" ></path><path d="M23.45 18.92a8 8 0 0 1 -1.75 -1.18 0.27 0.27 0 0 1 -0.07 -0.27 2.13 2.13 0 0 0 0.12 -0.72 2.25 2.25 0 0 0 -4.5 0 2.13 2.13 0 0 0 0.12 0.72 0.27 0.27 0 0 1 -0.07 0.27 8 8 0 0 1 -10.6 0 0.27 0.27 0 0 1 -0.07 -0.27 2.13 2.13 0 0 0 0.12 -0.72 2.25 2.25 0 0 0 -4.5 0 2.13 2.13 0 0 0 0.12 0.72 0.27 0.27 0 0 1 -0.07 0.27 8 8 0 0 1 -1.75 1.18A1 1 0 0 0 1 20.81a1 1 0 0 0 0.45 -0.1 10.16 10.16 0 0 0 1.65 -1 0.27 0.27 0 0 1 0.26 0 0.24 0.24 0 0 1 0.14 0.22V23a1 1 0 0 0 2 0v-3.13a0.24 0.24 0 0 1 0.14 -0.22 0.27 0.27 0 0 1 0.26 0 10 10 0 0 0 12.2 0 0.27 0.27 0 0 1 0.26 0 0.24 0.24 0 0 1 0.14 0.22V23a1 1 0 0 0 2 0v-3.13a0.24 0.24 0 0 1 0.14 -0.22 0.27 0.27 0 0 1 0.26 0 10.16 10.16 0 0 0 1.65 1 1 1 0 0 0 0.45 0.1 1 1 0 0 0 0.45 -1.89Z" ></path></g>
    </svg>
  )
}

export const ArtistIcon = ({ className="w-6 h-6" }) => { 
  return (
    <svg
      className={clsx("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M23.92 11.24a12.33 12.33 0 0 0 -9 -10.37 9.82 9.82 0 0 0 -5.78 0A12.47 12.47 0 0 0 0.36 9.75a11.88 11.88 0 0 0 3.16 11.38 2.5 2.5 0 0 0 3.08 0.36 1.5 1.5 0 0 0 0.26 -2.33l-0.81 -0.81a1 1 0 0 1 0 -1.42 1.1 1.1 0 0 1 1.6 -0.19c1.41 1.41 5.62 5.66 5.62 5.66a4 4 0 0 0 2.82 1.18 3.68 3.68 0 0 0 1.91 -0.53 12 12 0 0 0 5.92 -11.81Zm-9.44 7.62a2.49 2.49 0 0 1 0 -3.53 2.54 2.54 0 0 1 3.53 0 2.5 2.5 0 0 1 -3.53 3.53ZM14.25 7.2a2 2 0 0 1 2 -2 2 2 0 1 1 -2 2Zm3.69 6a1.5 1.5 0 0 1 2.12 -2.12 1.5 1.5 0 1 1 -2.12 2.12Zm-6.29 -8.48a2 2 0 1 1 -2.83 0 2 2 0 0 1 2.83 0Z"  ></path>
    </svg>
  )
}

export const GroupIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={clsx("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g id="Presentation--Streamline-Ultimate.svg"><path d="M8.5 9h7a0.51 0.51 0 0 0 0.4 -0.2 0.5 0.5 0 0 0 0.1 -0.44 4.21 4.21 0 0 0 -2.61 -2.84 0.25 0.25 0 0 1 -0.16 -0.2 0.24 0.24 0 0 1 0.1 -0.24 2.25 2.25 0 1 0 -2.62 0 0.22 0.22 0 0 1 0.1 0.24 0.25 0.25 0 0 1 -0.16 0.2A4.21 4.21 0 0 0 8 8.36a0.5 0.5 0 0 0 0.08 0.44 0.51 0.51 0 0 0 0.42 0.2Z" ></path><path d="M24 17.86A4.21 4.21 0 0 0 21.37 15a0.25 0.25 0 0 1 -0.16 -0.2 0.24 0.24 0 0 1 0.1 -0.24 2.25 2.25 0 1 0 -2.62 0 0.22 0.22 0 0 1 0.1 0.24 0.25 0.25 0 0 1 -0.16 0.2 3.62 3.62 0 0 0 -1 0.53 0.24 0.24 0 0 0 -0.1 0.25L18 18.3a0.26 0.26 0 0 0 0.25 0.2h5.25a0.51 0.51 0 0 0 0.4 -0.2 0.5 0.5 0 0 0 0.1 -0.44Z"  ></path><path d="M6.48 15.8a0.24 0.24 0 0 0 -0.1 -0.25 3.62 3.62 0 0 0 -1 -0.53 0.25 0.25 0 0 1 -0.16 -0.2 0.24 0.24 0 0 1 0.1 -0.24 2.25 2.25 0 1 0 -2.62 0 0.22 0.22 0 0 1 0.1 0.24 0.25 0.25 0 0 1 -0.16 0.2A4.21 4.21 0 0 0 0 17.86a0.5 0.5 0 0 0 0.08 0.44 0.51 0.51 0 0 0 0.4 0.2h5.23a0.26 0.26 0 0 0 0.29 -0.2Z"  ></path><path d="M15.67 11.8a1 1 0 0 0 -1 -0.8H9.31a1 1 0 0 0 -1 0.8l-2.08 10a1 1 0 0 0 0.2 0.83 1 1 0 0 0 0.78 0.37h9.54a1 1 0 0 0 0.78 -0.37 1 1 0 0 0 0.2 -0.83Zm-1.37 9a0.49 0.49 0 0 1 -0.38 0.17h-3.84a0.49 0.49 0 0 1 -0.38 -0.17 0.49 0.49 0 0 1 -0.12 -0.4l0.36 -2.5a0.49 0.49 0 0 1 0.49 -0.43h3.14a0.49 0.49 0 0 1 0.49 0.43l0.36 2.5a0.49 0.49 0 0 1 -0.12 0.43Z"  ></path></g>
    </svg>
  )
}