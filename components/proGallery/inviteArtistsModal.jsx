import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { XIcon } from "@heroicons/react/solid"
import { RoundedCurve } from "./roundedCurveSVG"

const InviteArtistsModal = ({ approvedArtists, onInvite, isOpen, onClose }) => {
  const [newApproveArtists, setNewApprovedArtists] = useState(approvedArtists || [])

  const handleInvite = () => {
    onInvite(newApproveArtists)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Artists">

      <p className="text-center mt-6">Artists must have a Collector account.</p>
      <p className="mx-auto p-2 mb-6 mt-2 font-bold rounded-xl border-2 border-neutral-200 dark:border-neutral-700">
        search by username or address
      </p>

      <div className="relative mx-auto w-fit">
        <p className="bg-neutral-200 dark:bg-neutral-700 h-6 font-bold">Approved Artists</p>
        <RoundedCurve className="absolute bottom-0 -left-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
        <RoundedCurve className="absolute bottom-0 -right-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700" />
      </div>
      <div className="mb-6 min-h-[4rem] border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 flex flex-wrap gap-2">
        {newApproveArtists.map((artist, i) => {
          return (
            <ArtistChip
              key={artist.username}
              artist={artist.username}
              onRemove={() => setNewApprovedArtists(newApproveArtists.filter(a => a.username !== artist.username))}
            />
          )
        })}
      </div>
      
      <div className="w-full flex justify-center gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleInvite} solid>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default InviteArtistsModal

const ArtistChip = ({ artist, onRemove }) => { 
  return (
    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl p-2">
      <p>{artist}</p>
      <button onClick={onRemove}>
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}