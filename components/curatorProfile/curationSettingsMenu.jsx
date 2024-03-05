import { useState } from "react"
import DeleteConfirmationModal from "../curations/deleteConfirmationModal"
import withdrawFromTreasury from "../../data/curation/withdrawFromTreasury"
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse"
import { roundToPrecision } from "../../utils/maths"
import { error, success } from "../../utils/toast"

const CurationSettingsMenu = ({ curation }) => { 
  // submittedTokens,
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { handleCollect, collectedFees, setCollectedFees } = useCurationAuctionHouse(curation)


  const curationType = curation?.curation_type

  const curatorBalance = collectedFees ? collectedFees.curatorBalance : 0
  const curatorFee = roundToPrecision(curatorBalance, 3)

  const fees = collectedFees ? <span>{curatorFee}◎</span> : <span className='animate-pulse'>...</span>

  //its ok to delete a group/curator curation because those listings are accessed via the submissions page
  const hasActiveListings = curation.type !== "curator" && submittedTokens?.filter(s => s.listed_status === "listed" || s.is_master_edition && s.listed_status === "sold").length
  const hasUncollectedFees = collectedFees?.curatorBalance
  const disabledDelete = hasActiveListings || hasUncollectedFees

  const disabledDeleteText = (() => {
    if (hasActiveListings) return "Please close active listings before deleting"
    if (hasUncollectedFees) return "Please withdraw your fees before deleting"
  })();


  const openDelete = () => {
    setDeleteModalOpen(true)
  }

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        name={curation?.name}
      />
      
    </>
  )
}

export default CurationSettingsMenu