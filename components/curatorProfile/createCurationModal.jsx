import { useContext, useEffect, useState } from "react"
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

const CreateCurationModal = ({ isOpen, onClose }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const { newName: curationName, nameError, nameValid, setNewName } = useEditName("")

  const [curatorFee, setCuratorFee] = useState(undefined)
  const [curatorFeeError, setCuratorFeeError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [curationType, setCurationType] = useState("curator") //"artist", "collector"

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
      <div className="flex items-center gap-2 justify-center mt-2">
        <p className="flex gap-1">
          <span>Curator</span>
          <Tippy
            content="Curate artwork from a variety of artists"
            className="shadow-lg"
          >
            <InformationCircleIcon className="w-4" />
          </Tippy>
        </p>
        <Switch
          checked={typeChecked}
          onChange={(checked) => setCurationType(checked ? "artist" : "curator")}
          className={clsx(
            'bg-neutral-100 dark:bg-neutral-900',
            "border-neutral-200 dark:border-neutral-700 border-2",
            "relative inline-flex h-8 w-14 items-center rounded-full flex-shrink-0"
          )}
        >
          <span className="sr-only">Toggle curation type</span>
          <span
            className={clsx(typeChecked ? 'translate-x-7' : 'translate-x-1',
              "inline-block h-5 w-5 transform rounded-full transition bg-neutral-900 dark:bg-neutral-100",
              "stroke-white dark:stroke-neutral-900 stroke-2"
            )}
          >
            {/* {typeChecked
              ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>

              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            } */}
          </span>
        </Switch>
        <p className="flex gap-1">
          <span>Artist</span>
          <Tippy
            content="Curate artwork you have created"
            className="shadow-lg"
          >
            <InformationCircleIcon className="w-4" />
          </Tippy>
        </p>
      </div>


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
          placeholder="Curation Name"
          onChange={(e) => setNewName(e.target.value.replace(" ", "_"))}
          value={curationName}
        />
        <p className="text-sm pl-4 italic text-red-500 h-4">{nameError}</p>
      </div>

      {curationType === "curator" ? (
        <div>
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
          <p className="text-sm mb-2 pl-4 italic text-red-500 h-4">{curatorFeeError}</p>
        </div>
      ) : null}

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