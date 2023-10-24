import { v4 as uuidv4 } from 'uuid';
import MainButton, { WarningButton } from '../MainButton';
import {  CheckIcon, ChevronDownIcon, PlusIcon, UserAddIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
import { roundToPrecision } from '../../utils/maths';
import { useState } from 'react';
import Tippy from '@tippyjs/react';
import { Oval } from 'react-loader-spinner';

const AuthorizedViewerBar = ({
  setOpen,
  isOpen,
  handleInviteSelf,
  isEditingDraft,
  setIsEditingDraft,
  isPublished,
  isApproved
}) => {
  const toggleEditOpen = () => { 
    setOpen(prev => !prev);
  }

  const getTabText = () => {
    if (!isEditingDraft) return "Published";
    return "Draft";
  }


  const addButton = isApproved
    ? <MainButton
        disabled
        className="flex gap-2 items-center "
        solid
      >
        Approved <CheckIcon className="h-6 w-6 text-emerald-500" />
      </MainButton>
    : <MainButton
        onClick={handleInviteSelf}
        className="flex gap-2 items-center "
        solid
      >
        Add yourself <UserAddIcon className="w-5 h-5" />
      </MainButton>
  const draftButtons = (
    <>
      <div />

      {addButton}
  
      <MainButton
        disabled={!isPublished}
        onClick={() => setIsEditingDraft(false)}
      >
        {isPublished ? "View Published" : "Not Published"}
      </MainButton>
    </>
  )

  const publishedButtons = (
    <>
      <div />

      {addButton}

      <MainButton
        className=""
        onClick={() => setIsEditingDraft(true)}
      >
        View Draft
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
            <p>{isOpen ? "Close" : "Open"}</p>
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

export default AuthorizedViewerBar