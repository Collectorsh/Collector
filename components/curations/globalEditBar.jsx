import { v4 as uuidv4 } from 'uuid';
import MainButton, { WarningButton } from '../MainButton';
import {  ChevronDownIcon, PlusIcon, UserAddIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
import { roundToPrecision } from '../../utils/maths';
import { useState } from 'react';
import Tippy from '@tippyjs/react';
import { Oval } from 'react-loader-spinner';

const GlobalEditBar = ({
  setModules,
  setOpen,
  isOpen,
  openPublish,
  handleInviteArtists,
  isEditingDraft,
  setIsEditingDraft,
  isPublished,
  hasChanges,
  openUnpublish,
  noContent,
  collectedFees,
  handleWithdrawFees
}) => {
  const [withdrawing, setWithdrawing] = useState(false)
  
  const addArtModule = () => {
    setModules((prev) => [...prev, { type: "art", id: uuidv4(), tokens: [] }])
    window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  const addTextModule = () => {
    setModules((prev) => [...prev, { type: "text", id: uuidv4(), textDelta: undefined }])
    window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  const toggleEditOpen = () => { 
    setOpen(prev => !prev);
  }

  const getTabText = () => {
    if (!isEditingDraft) return "Published";
    if (hasChanges) return "Draft: Unpublished"
    return "Draft: Up To Date"
  }

  const handleWithdraw = async () => { 
    setWithdrawing(true)
    await handleWithdrawFees()
    setWithdrawing(false)
  }

  const draftButtons = (
    <>
      <div className='flex gap-4 flex-wrap justify-center md:place-self-start'>
        <MainButton
          solid
          className="flex gap-2 items-center"
          onClick={addArtModule}
        >
          Add Art Module <PlusIcon className="w-5 h-5" />
        </MainButton>
        <MainButton
          className="flex gap-2 items-center"
          onClick={addTextModule}
        >
          Add Text Module <PlusIcon className="w-5 h-5" />
        </MainButton>
      </div>

      <MainButton
        onClick={handleInviteArtists}
        className="flex gap-2 items-center "
        solid
      >
        Invite Artists <UserAddIcon className="w-5 h-5" />
      </MainButton>
      
      <div className='flex gap-4 flex-wrap justify-center  md:place-self-end'>
        <MainButton
          disabled={!isPublished}
          onClick={() => setIsEditingDraft(false)}
        >
          {isPublished ? "View Published" : "Not Published"}
        </MainButton>

        <MainButton
          className="flex gap-2 items-center"
          onClick={openPublish}
          solid
          disabled={!hasChanges && isPublished || noContent}
        >
          Publish Draft
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
          </svg>
        </MainButton>
      </div>
    </>
  )

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)
  const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>

  const publishedButtons = (
    <>
      <div className='flex gap-4 flex-wrap justify-center md:place-self-start'>
        <WarningButton
          onClick={openUnpublish}
        >
          Unpublish
        </WarningButton>
        <MainButton
          onClick={handleWithdraw}
          disabled={withdrawing || !curatorBalance} 
          className="min-w-[250px]"
        >
          {withdrawing
            ? (
              <span className="inline-block translate-y-0.5">
                <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
              </span>
            )
            : (
              <>
                <span>Withdraw Fees</span>
                <Tippy
                  content="Minus Solana transaction fees"
                >
                  <span> ({fees})</span>
                </Tippy>
              </>
            )
          }
        </MainButton>
          
      </div>
      <MainButton
        onClick={handleInviteArtists}
        className="flex gap-2 items-center"
        solid
        >
        Invite Artists <UserAddIcon className="w-5 h-5" />
      </MainButton>
      <MainButton
        onClick={() => setIsEditingDraft(true)}
      >
        Edit Draft
      </MainButton>

    </>
  )
  return (
    <div className={clsx("w-full",
      'fixed bottom-0 left-0 duration-300 ',
      isOpen ? "translate-y-0" : "translate-y-full",
      "bg-white dark:bg-neutral-900",
      "shadow-black/10 dark:shadow-white/10",
      "drop-shadow-[0px_-2px_6px_var(--tw-shadow-color)]",
      "z-[1000]"
    )}>
      <div className={clsx(
        'w-full p-2',
        "shadow-neutral-300 dark:shadow-neutral-700",
        "shadow-[0px_-4px_0px_var(--tw-shadow-color)]"
      )}>
        <button
          className="absolute right-[50%] translate-x-[50%] -top-12 h-12 w-32 translate-y-[1px] font-bold
          bg-white dark:bg-neutral-900
          p-0 hover:scale-110 origin-bottom duration-300
          drop-shadow-[0px_-4px_0px_var(--tw-shadow-color)]
          "
          onClick={toggleEditOpen}
        >
          <RoundedCurve
            className="absolute top-0 -right-20 w-20 h-12 -translate-x-[1px] bg-transparent duration-300
            fill-white dark:fill-neutral-900
            "
          />
          <RoundedCurve
            className="absolute top-0 -left-20 scale-x-[-1] w-20 h-12 translate-x-[1px] bg-transparent duration-300
            fill-white dark:fill-neutral-900
            "
          />

          <div className='relative flex justify-center items-center pl-2'>
            <p>{isOpen ? "Close Edit" : "Open Edit"}</p>
            <ChevronDownIcon className={clsx("w-5 h-5 duration-300", isOpen ? "rotate-0":"-rotate-180")}/>
          </div>
          <p className='text-sm font-normal'>{getTabText()}</p>

        </button>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] place-items-center max-w-screen-xl mx-auto gap-4 my-2">
          {isEditingDraft ? draftButtons : publishedButtons}
        </div>

      </div>
    </div>
  )
}

export default GlobalEditBar