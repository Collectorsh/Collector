import { v4 as uuidv4 } from 'uuid';
import MainButton, { WarningButton } from '../MainButton';
import { ChevronDownIcon, PlusIcon, UserAddIcon, TagIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
import { roundToPrecision } from '../../utils/maths';
import { useState } from 'react';
import Tippy from '@tippyjs/react';
import { Oval } from 'react-loader-spinner';
import EditListingsModal from '../artistSubmissions/editListingsModal';
import * as Icon from 'react-feather'

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
  handleWithdrawFees,
  curation,
  submittedTokens,
  // curationType //"curator", "artist", "collector
}) => {
  const [withdrawing, setWithdrawing] = useState(false)
  const [editListingsOpen, setEditListingsOpen] = useState(false)

  const curationType = curation?.curation_type
  const curationWithSubmissions = {
    ...curation,
    submitted_token_listings: submittedTokens
  }
  
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
    if (hasChanges) return "Draft - Unpublished"
    return "Draft - Up To Date"
  }

  const handleWithdraw = async () => { 
    setWithdrawing(true)
    await handleWithdrawFees()
    setWithdrawing(false)
  }

  const handleEditListings = () => { }
  const handleRemoveListing = () => { }

  const actionButton = curationType === "curator"
    ? (
      <MainButton
        onClick={handleInviteArtists}
        className="flex gap-2 items-center justify-center w-[10.75rem] "
        solid
      >
        Invite Artists 
        <Icon.UserPlus size={18} strokeWidth={2.5} />
      </MainButton>
    )
    : (
      <MainButton
        onClick={() => setEditListingsOpen(true)}
        className="flex gap-2 items-center justify-center w-[10.25rem] "
        solid
      >
        Edit Listings 
        <Icon.Tag size={18} strokeWidth={2.5} />
      </MainButton>
    )
  
  const centralText = ( 
    <div className='text-center relative'>
      <p className='text-xs textPalette3 leading-none'>viewing</p>
      <p className='font-bold textPalette2'>{getTabText()}</p>
    </div>
  )

  const draftButtons = (
    <>
      <div className='flex gap-4 flex-wrap justify-center  place-self-center'>
        <Tippy content="View Published" className='shadow'>
          <MainButton
            className={clsx(!isPublished && "hidden", "flex gap-2 items-center justify-center px-2")}
            onClick={() => setIsEditingDraft(false)}
            noPadding
          >
            {/* View Published */}
            <Icon.Eye size={18} strokeWidth={2.5} />
          </MainButton>
        </Tippy>

        <MainButton
          className="flex gap-2 items-center justify-center w-[10.25rem]"
          onClick={openPublish}
          solid
          disabled={!hasChanges && isPublished || noContent}
        >
          Publish Draft
          <Icon.Upload size={18} strokeWidth={2.5} />
        </MainButton>
      </div>

      {centralText}

      <div className='flex gap-4 flex-wrap justify-center place-self-center'>
        {actionButton}
      </div>

    </>
  )

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)
  const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>

  const publishedButtons = (
    <>
      <div className='flex gap-4 flex-wrap justify-center md:place-self-start w-full'>
        <WarningButton
          className="w-[7.2rem]"
          onClick={openUnpublish}
        >
          Unpublish
        </WarningButton>

        <MainButton
          className="w-[7.2rem]"
          solid
          onClick={() => setIsEditingDraft(true)}
        >
          Edit Draft
        </MainButton>
      </div>

      {centralText}

      <div className='flex gap-4 flex-wrap justify-center place-self-center'>
        {actionButton}

        {curationType === "curator" ? (
          <Tippy
            content={!curatorBalance ? "Currently no fees have been collected" : <p>Withdraw {fees}</p>}
            className='shadow'
          >
            <div>
              <MainButton
                onClick={handleWithdraw}
                disabled={withdrawing || !curatorBalance}
                className="flex gap-2 items-center justify-center w-[10.75rem]"
              >
                {withdrawing
                  ? (
                    <Oval color="#FFF" secondaryColor="#666" height={16} width={16} strokeWidth={4} className="translate-y-0.5" />
                  )
                  : "Withdraw Fees ◎"
                }
              </MainButton>

            </div>
          </Tippy>
        ) : null}
      </div>
    </>
  )
  return (
    <>
      <div
        className={clsx('fixed bottom-0 right-0 -rotate-45 h-10 w-10', isOpen && "hidden")}
      >
        <button
          onClick={toggleEditOpen}
          className='hoverPalette2 borderPalette2 border-4 palette2 absolute left-1/2 -translate-x-[50%] top-0 h-[150%] w-[300%] flex justify-center items-start pt-1'>
          <Icon.ArrowUp strokeWidth={2.5}/>
        </button>
      </div>
      <div className={clsx("w-full",
        'fixed bottom-0 left-0 duration-300 ',
        isOpen ? "translate-y-0 translate-x-0" : "translate-y-full translate-x-4",
        "palette2",
        "z-[1000]"
      )}>
        

        <EditListingsModal
          isOpen={editListingsOpen}
          onClose={() => setEditListingsOpen(false)}
          handleEditListings={handleEditListings}
          handleRemoveListing={handleRemoveListing}
          curation={curationWithSubmissions}
        />
        <div className={clsx(
          'w-full py-2 px-4',
          "borderPalette2 border-t-2 flex justify-between"
        )}>
          {/* <button
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

          </button> */}
          <div className='w-10'/>
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] place-items-center max-w-screen-xl mx-auto gap-4 py-2 px-4">
            {isEditingDraft ? draftButtons : publishedButtons}
          </div>
            <button
              className='align-right rounded-lg p-2 hoverPalette2'
              onClick={toggleEditOpen}
            >
            <Icon.ArrowDownRight strokeWidth={2.5} />
            </button>

        </div>
      </div>
    </>
  )
}

export default GlobalEditBar