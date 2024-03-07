import { v4 as uuidv4 } from 'uuid';
import MainButton, { WarningButton } from '../MainButton';
import clsx from 'clsx';
import { RoundedCurve } from './roundedCurveSVG';
import { roundToPrecision } from '../../utils/maths';
import { useMemo, useState } from 'react';
import Tippy from '@tippyjs/react';
import { Oval } from 'react-loader-spinner';
import EditListingsModal from '../artistSubmissions/editListingsModal';
import * as Icon from 'react-feather'
import DeleteConfirmationModal from './deleteConfirmationModal';

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

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)
  const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>

  const toggleEditOpen = () => { 
    setOpen(prev => !prev);
  }

  const getTabText = () => {
    if (!isEditingDraft) return "Published";
    if (hasChanges) return "Draft - Unpublished"
    return "Draft - Up To Date"
  }

 

  const handleEditListings = () => { }
  const handleRemoveListing = () => { }

  const handleWithdraw = async () => {
    setWithdrawing(true)
    await handleWithdrawFees()
    setWithdrawing(false)
  }

  const actionButton = curationType === "curator"
    ? (
      <div className='flex items-center justify-center flex-wrap gap-4'>
        <MainButton
          onClick={handleInviteArtists}
          className="flex gap-2 items-center justify-center w-[12.5rem] "
          // solid
          size="lg"
        >
          Invite Artists 
          <Icon.UserPlus size={18} strokeWidth={2.5} />
        </MainButton>
     
        <Tippy
          content={!curatorBalance ? "Currently no fees have been collected" : <p>Withdraw {fees}</p>}
          className='shadow'
        >
          <div>
            <MainButton
              size="lg"
              solid
              onClick={handleWithdraw}
              disabled={withdrawing || !curatorBalance}
              className="flex gap-2 items-center justify-center w-[12.5rem]"
            >
              {withdrawing
                ? (
                  <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} className="translate-y-0.5" />
                )
                : "Withdraw Fees ◎"
              }
            </MainButton>

          </div>
        </Tippy>
 
      </div>
    )
    : (
      <MainButton
        onClick={() => setEditListingsOpen(true)}
        className="flex gap-2 items-center justify-center w-[12rem] "
        // solid
        size="lg"
      >
        List
        <Icon.Tag size={18} strokeWidth={2.5} />
      </MainButton>
    )

  return (
    <>
      <Tippy
        content={"Switch to edit view"}
      >
        <div
          className={clsx('z-10 fixed bottom-0 left-0 rotate-45 h-10 w-10')}
        >
          <button
            onClick={toggleEditOpen}
            className={clsx(
              'hoverPalette2 borderPalette2 border-2 palette2 absolute right-1/2 translate-x-[50%] h-[150%] w-[300%] flex justify-center items-start pt-1',
              isOpen ? "top-full " : "top-0"
            )} >
            
            <Icon.Edit className="-rotate-45" />
            
          </button>
        </div>
      </Tippy>

      <div className={clsx("w-full",
        'fixed bottom-0 left-0 duration-300 ',
        isOpen ? "translate-y-0 translate-x-0" : "translate-y-full",
        "palette2",
        "z-[1000]"
      )}>
        <div className={clsx(
          'w-full py-3 px-4',
          "borderPalette2 border-t-2 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-4 place-items-center"
        )}>
          <div className="place-self-start flex items-center gap-3 my-auto"> 
            <Tippy
              content={"Switch to public view"}
            >  
              <button
                onClick={toggleEditOpen}
                className='hoverPalette2 p-2 rounded-full '
              >
                <Icon.Eye />
              </button>
            
            </Tippy>
            <div className='text-left relative hidden md:block'>
              <p className='text-xs textPalette3 leading-none'>viewing</p>
              <p className='font-bold textPalette2'>{getTabText()}</p>
            </div>
          </div>

          <div className='md:hidden'>
            <p className='text-center text-sm'>
              Editing curations is currently supported on desktop only. Please switch to a desktop to continue. Thank you!
            </p>
          </div>
          
          <div className='hidden md:block md:place-self-center'>
            {actionButton}
          </div>

          <MainButton
            className="hidden md:flex md:place-self-end gap-2 items-center justify-center md:mr-2 w-[12rem] my-auto"
            onClick={openPublish}
            solid
            disabled={noContent}
            size="lg"
          >
            Publish Draft
            <Icon.Upload size={18} strokeWidth={2.5} />
          </MainButton>

        </div>
      </div>

      <EditListingsModal
        isOpen={editListingsOpen}
        onClose={() => setEditListingsOpen(false)}
        handleEditListings={handleEditListings}
        handleRemoveListing={handleRemoveListing}
        curation={curationWithSubmissions}
      />
    </>
  )
}

export default GlobalEditBar