import MainButton from '../MainButton';
import clsx from 'clsx';
import * as Icon from 'react-feather'

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

  const centralText = (
    <div className='text-center relative'>
      <p className='text-xs textPalette3 leading-none'>viewing</p>
      <p className='font-bold textPalette2'>{getTabText()}</p>
    </div>
  )

  const addButton = isApproved
    ? <MainButton
        disabled
      className="flex gap-2 items-center justify-center w-[11.13rem]"
      solid
      size="lg"
      >
        Approved
        <Icon.Check strokeWidth={2.5} className="stroke-emerald-500" size={18} />
      </MainButton>
    : <MainButton
        onClick={handleInviteSelf}
      className="flex gap-2 items-center justify-center min-w-[11.13rem]"
      solid
      size="lg"
      >
        Add yourself 
        <Icon.UserPlus size={18} strokeWidth={2.5} />
    </MainButton>
  
  const viewButton = isEditingDraft 
    ? <MainButton
        disabled={!isPublished}
      onClick={() => setIsEditingDraft(false)}
      size="lg"
      className="w-[11.13rem]"
      >
        {isPublished ? "View Published" : "Not Published"}
      </MainButton>
    : <MainButton
      className="w-[11.13rem]"
      onClick={() => setIsEditingDraft(true)}
      size="lg"
      >
        View Draft
      </MainButton>
  
  return (
    <>
      <div
        className={clsx('fixed bottom-0 left-0 rotate-45 h-10 w-10', isOpen && "hidden")}
      >
        <button
          onClick={toggleEditOpen}
          className='hoverPalette2 borderPalette2 border-2 palette2 absolute right-1/2 translate-x-[50%] top-0 h-[150%] w-[300%] flex justify-center items-start pt-1'>
          <Icon.ArrowUp strokeWidth={2.5} />
        </button>
      </div>

      <div className={clsx("w-full",
        'fixed bottom-0 left-0 duration-300 ',
        isOpen ? "translate-y-0 translate-x-0" : "translate-y-full -translate-x-4",
        "palette2",
        "z-[1000]"
      )}>
        <div className={clsx(
          'w-full py-2 px-4',
          "borderPalette2 border-t-2 flex justify-between items-center"
        )}>
          <button
            className='align-left p-2 hoverPalette2 rounded-full'
            onClick={toggleEditOpen}
            >
            <Icon.ArrowDownLeft strokeWidth={2.5} />
          </button>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 place-items-center max-w-screen-xl mx-auto gap-4 py-2 px-4">
            {addButton}
            {centralText}
            {viewButton}
          </div>

          <div className='w-10' />
        </div>
      </div>
    </>
  )
  // return (
  //   <div className={clsx("w-full",
  //     'fixed bottom-0 left-0 duration-300 ',
  //     isOpen ? "translate-y-0" : "translate-y-full",
  //     "bg-white dark:bg-neutral-900",
  //     "shadow-black/10 dark:shadow-white/10",
  //     "drop-shadow-[0px_-2px_6px_var(--tw-shadow-color)]",
  //     "z-[1000]"
  //   )}>
  //     <div className={clsx(
  //       'w-full p-2',
  //       "shadow-neutral-300 dark:shadow-neutral-700",
  //       "shadow-[0px_-4px_0px_var(--tw-shadow-color)]"
  //     )}>
  //       <button
  //         className="absolute right-[50%] translate-x-[50%] -top-12 h-12 w-32 translate-y-[1px] font-bold
  //         bg-white dark:bg-neutral-900
  //         p-0 hover:scale-110 origin-bottom duration-300
  //         drop-shadow-[0px_-4px_0px_var(--tw-shadow-color)]
  //         "
  //         onClick={toggleEditOpen}
  //       >
  //         <RoundedCurve
  //           className="absolute top-0 -right-20 w-20 h-12 -translate-x-[1px] bg-transparent duration-300
  //           fill-white dark:fill-neutral-900
  //           "
  //         />
  //         <RoundedCurve
  //           className="absolute top-0 -left-20 scale-x-[-1] w-20 h-12 translate-x-[1px] bg-transparent duration-300
  //           fill-white dark:fill-neutral-900
  //           "
  //         />

  //         <div className='relative flex justify-center items-center pl-2'>
  //           <p>{isOpen ? "Close" : "Open"}</p>
  //           <ChevronDownIcon className={clsx("w-5 h-5 duration-300", isOpen ? "rotate-0":"-rotate-180")}/>
  //         </div>
  //         <p className='text-sm font-normal'>{getTabText()}</p>

  //       </button>
  //       <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] place-items-center max-w-screen-xl mx-auto gap-4 my-2">
  //         {isEditingDraft ? draftButtons : publishedButtons}
  //       </div>

  //     </div>
  //   </div>
  // )
}

export default AuthorizedViewerBar