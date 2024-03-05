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
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const curationType = curation?.curation_type
  const curationWithSubmissions = {
    ...curation,
    submitted_token_listings: submittedTokens
  }

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)
  const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>

  // //its ok to delete a group/curator curation because those listings are accessed via the submissions page
  // const hasActiveListings = curation.type !== "curator" && submittedTokens?.filter(s => s.listed_status === "listed" || s.is_master_edition && s.listed_status === "sold").length
  // const hasUncollectedFees = collectedFees?.curatorBalance
  // const disabledDelete = hasActiveListings || hasUncollectedFees
  
  // const disabledDeleteText = (() => {
  //   if(hasActiveListings) return "Please close active listings before deleting"
  //   if (hasUncollectedFees) return "Please withdraw your fees before deleting"
  // })();

  

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
  
  const centralText = ( 
    <div className='text-left relative'>
      <p className='text-xs textPalette3 leading-none'>viewing</p>
      <p className='font-bold textPalette2'>{getTabText()}</p>
    </div>
  )

  // const draftButtons = (
  //   <>
  //     <div className='flex gap-4 flex-wrap justify-center  place-self-center'>
  //       <Tippy content="View Published" className='shadow'>
  //         <MainButton
  //           className={clsx(!isPublished && "hidden", "flex gap-2 items-center justify-center px-2 rounded-md")}
  //           onClick={() => setIsEditingDraft(false)}
  //           noPadding
  //         >
  //           {/* View Published */}
  //           <Icon.Eye size={18} strokeWidth={2.5} />
  //         </MainButton>
  //       </Tippy>

  //       <MainButton
  //         className="flex gap-2 items-center justify-center w-[10.25rem]"
  //         onClick={openPublish}
  //         solid
  //         disabled={!hasChanges && isPublished || noContent}
  //       >
  //         Publish Draft
  //         <Icon.Upload size={18} strokeWidth={2.5} />
  //       </MainButton>
  //     </div>

  //     {centralText}

  //     <div className='flex gap-4 flex-wrap justify-center place-self-center'>
  //       {actionButton}
  //     </div>

  //   </>
  // )

  // const publishedButtons = (
  //   <>
  //     <div className='flex gap-4 flex-wrap justify-center md:place-self-start w-full'>
  //       <WarningButton
  //         className="w-[7.2rem]"
  //         onClick={openUnpublish}
  //       >
  //         Unpublish
  //       </WarningButton>

  //       <MainButton
  //         className="w-[7.2rem]"
  //         solid
  //         onClick={() => setIsEditingDraft(true)}
  //       >
  //         Edit Draft
  //       </MainButton>
  //     </div>

  //     {centralText}

  //     <div className='flex gap-4 flex-wrap justify-center place-self-center'>
  //       {actionButton}

  //       {curationType === "curator" ? (
  //         <Tippy
  //           content={!curatorBalance ? "Currently no fees have been collected" : <p>Withdraw {fees}</p>}
  //           className='shadow'
  //         >
  //           <div>
  //             <MainButton
  //               onClick={handleWithdraw}
  //               disabled={withdrawing || !curatorBalance}
  //               className="flex gap-2 items-center justify-center w-[10.75rem]"
  //             >
  //               {withdrawing
  //                 ? (
  //                   <Oval color="#FFF" secondaryColor="#666" height={16} width={16} strokeWidth={4} className="translate-y-0.5" />
  //                 )
  //                 : "Withdraw Fees ◎"
  //               }
  //             </MainButton>

  //           </div>
  //         </Tippy>
  //       ) : null}
  //     </div>
  //   </>
  // )
  return (
    <>
      {/* <div
        className={clsx('fixed bottom-0 right-0 -rotate-45 h-10 w-10', isOpen && "hidden")}
      >
        <button
          onClick={toggleEditOpen}
          className='hoverPalette2 borderPalette2 border-2 palette2 absolute left-1/2 -translate-x-[50%] top-0 h-[150%] w-[300%] flex justify-center items-start pt-1'>
          <Icon.ArrowUp strokeWidth={2.5}/>
        </button>
      </div> */}

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
        isOpen ? "translate-y-0 translate-x-0" : "translate-y-full -translate-x-10",
        "palette2",
        "z-[1000]"
      )}>
        {/* <button
          className='align-right rounded-lg p-2 hoverPalette2'
          onClick={toggleEditOpen}
        >
          <Icon.ArrowDownRight strokeWidth={2.5} />
        </button> */}
        <div className={clsx(
          'w-full py-3 px-4',
          "borderPalette2 border-t-2 grid md:grid-cols-3"
        )}>
          <div className="place-self-start flex items-center gap-3"> 
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
            {centralText}
          </div>
          
          <div className='place-self-center'>
            {actionButton}
          </div>

          <MainButton
            className="flex gap-2 items-center justify-center mr-2 place-self-end w-[12rem]"
            onClick={openPublish}
            solid
            disabled={noContent}
            size="lg"
          >
            Publish Draft
            <Icon.Upload size={18} strokeWidth={2.5} />
          </MainButton>

        </div>

        {/* <div className={clsx(
          'w-full py-2 px-4',
          "borderPalette2 border-t-2 flex justify-between"
        )}>
          <Tippy disabled={!disabledDelete} content={disabledDeleteText}>
            <div>
              <button
                className={clsx('h-full align-left rounded-lg p-2 hoverPalette2 disabled:opacity-50 disabled:palette2')}
                onClick={openDelete}
                disabled={disabledDelete}
              >
                <Icon.Trash2 strokeWidth={2.5} size={22} color="red"/>
              </button>

            </div>
          </Tippy>
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] place-items-center max-w-screen-xl mx-auto gap-4 py-2 px-4">
            {isEditingDraft ? draftButtons : publishedButtons}
          </div>
        </div> */}
      </div>

      <EditListingsModal
        isOpen={editListingsOpen}
        onClose={() => setEditListingsOpen(false)}
        handleEditListings={handleEditListings}
        handleRemoveListing={handleRemoveListing}
        curation={curationWithSubmissions}
      />
      {/* <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        name={curation?.name}
      /> */}
    </>
  )
}

export default GlobalEditBar