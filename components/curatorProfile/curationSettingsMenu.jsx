import { Fragment, useState } from "react"
import DeleteConfirmationModal from "../curations/deleteConfirmationModal"
import withdrawFromTreasury from "../../data/curation/withdrawFromTreasury"
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse"
import { roundToPrecision } from "../../utils/maths"
import { error, success } from "../../utils/toast"
import UnpublishConfirmationModal from "../curations/unpublishConfirmationModal"
import { Menu, Transition } from "@headlessui/react"
import * as Icon from 'react-feather'
import Link from "next/link"
import clsx from "clsx"
import { unpublishContent } from "../../data/curation/publishContent"
import Tippy from "@tippyjs/react"

//TODO add submitted_token_listings to gallery fetched curations

//TODO add private_key_hash to fetch values when user is owner on gallery page
//add withdraw fees button 

const CurationSettingsMenu = ({ curation}) => { 
  console.log("🚀 ~ CurationSettingsMenu ~ curation:", curation)
  // submittedTokens,
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);

  const { handleCollect, collectedFees, setCollectedFees } = useCurationAuctionHouse(curation)

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)
  // const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>


  const curationType = curation?.curation_type
  const submittedTokens = curation?.submitted_token_listings

  //its ok to delete a group/curator curation because those listings are accessed via the submissions page
  const hasActiveListings = curation.type !== "curator" && submittedTokens?.filter(s => s.listed_status === "listed" || s.is_master_edition && s.listed_status === "sold").length
  const hasUncollectedFees = collectedFees?.curatorBalance
  const disabledDelete = hasActiveListings || hasUncollectedFees

  const disabledDeleteText = (() => {
    if (hasActiveListings) return "Please close active listings before deleting"
    if (hasUncollectedFees) return "Please withdraw your fees before deleting"
  })();


  const openDelete = (e) => {
    if (disabledDelete) return
    
    setDeleteModalOpen(true)
  }

  const handleUnpublish = async () => {
    const res = await unpublishContent({
      apiKey: user.api_key,
      name: curation.name
    })

    if (res?.status === "success") {
      success(`${ curation.name } is unpublished`)
    } else {
      error(`${ curation.name } unpublish failed`)
    }
  }

  // const handleWithdrawFees = async () => {
  //   if (!privateKeyHash) return;
  //   const res = await withdrawFromTreasury({
  //     privateKeyHash,
  //     curation,
  //   })

  //   if (res?.status === "success") {
  //     success(`Successfully withdrew ${ roundToPrecision(collectedFees.curatorBalance, 3) } SOL!`)
  //     setCollectedFees({
  //       curatorBalance: 0,
  //       platformBalance: 0
  //     })
  //   } else {
  //     error(`Withdrawal failed`)
  //   }
  // }

  return (
    <>
      
      <Menu
        as="div" className="absolute z-[19] -top-1 -right-1"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        {({ open,  }) => (
          <>
            <Menu.Button
              className={clsx(
                "rounded-lg border-4 palette1 border-neutral-300 dark:border-neutral-700 p-1 origin-top-right",
                "flex items-center gap-3 duration-300",
                " hover:scale-105"
              )}
            >
              <span className="sr-only">Open curation settings</span>
              <Icon.Settings />
              {/* <Icon.ChevronDown
                size={20}
                strokeWidth={2.6}
                className={clsx("duration-300", open ? "transform rotate-180" : "")}
              /> */}
             
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
               
                className="palette2 origin-top-right absolute right-1 mt-1 py-1 w-fit overflow-hidden rounded-md shadow-md outline-none text-left px-2"
              >
              
                {/* <Menu.Item>
                  <Link href={`/curations/${ curation.name }`} passHref>
                    <p className="p-2 hoverPalette2 rounded-md">
                      Edit Draft
                    </p>
                  </Link>
                </Menu.Item>

                <hr className="my-1 borderPalette3" /> */}

                {curation.is_published ? (
                  <Menu.Item >
                    <button
                      onClick={() => setUnpublishModalOpen(true)}
                      className="block p-2 hoverPalette2 rounded-md w-full text-left"
                    >
                      Unpublish
                    </button>
                  </Menu.Item>

                ) : null}

                <Menu.Item>
                  <Tippy disabled={!disabledDelete} content={disabledDeleteText}>
                    <div>
                      <button
                        onClick={openDelete}
                        disabled={disabledDelete}
                        className="block p-2 hoverPalette2 rounded-md w-full text-left text-red-500 disabled:cursor-default disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </Tippy>
                </Menu.Item>
      
              </Menu.Items>
            </Transition>
            <DeleteConfirmationModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              name={curation?.name}
            />
            <UnpublishConfirmationModal
              name={curation?.name}
              isOpen={unpublishModalOpen}
              onClose={() => setUnpublishModalOpen(false)}
              onUnpublish={handleUnpublish}
            />
          </>
        )}
      </Menu>
    </>
  )
}

export default CurationSettingsMenu