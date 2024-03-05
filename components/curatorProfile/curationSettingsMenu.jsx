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

const CurationSettingsMenu = ({ curation}) => { 
  console.log("🚀 ~ CurationSettingsMenu ~ curation:", curation)
  // submittedTokens,
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);

  const { handleCollect, collectedFees, setCollectedFees } = useCurationAuctionHouse(curation)


  const curationType = curation?.curation_type
  const submittedTokens = curation?.submitted_token_mints


  //its ok to delete a group/curator curation because those listings are accessed via the submissions page
  const hasActiveListings = curation.type !== "curator" && submittedTokens?.filter(s => s.listed_status === "listed" || s.is_master_edition && s.listed_status === "sold").length
  const hasUncollectedFees = collectedFees?.curatorBalance
  const disabledDelete = hasActiveListings || hasUncollectedFees

  const disabledDeleteText = (() => {
    if (hasActiveListings) return "Please close active listings before deleting"
    if (hasUncollectedFees) return "Please withdraw your fees before deleting"
  })();


  const openDelete = (e) => {
    // e.stopPropagation()
    // e.preventDefault()
    // setDeleteModalOpen(true)
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
              // onClick={(e) => {
              //   e.stopPropagation()
              //   e.preventDefault()
              // }}
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
               
                className="palette2 origin-top-right absolute right-2 mt-1 py-1 w-fit overflow-hidden rounded-md shadow-md outline-none text-left px-2"
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
                      onClick={(e) => {
                        // e.stopPropagation()
                        // e.preventDefault()
                        // setUnpublishModalOpen(true)
                      }}
                      className="block p-2 hoverPalette2 rounded-md w-full text-left"
                    >
                      Unpublish
                    </button>
                  </Menu.Item>

                ) : null}

                <Menu.Item>
                  <button
                    onClick={openDelete}
                    disabled={disabledDelete}
                    className="block p-2 hoverPalette2 rounded-md w-full text-left text-red-500"
                  >
                    Delete
                  </button>
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