import { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { XIcon } from "@heroicons/react/solid"
import { RoundedCurve } from "./roundedCurveSVG"
import SearchBar from "../SearchBar"
import getUserFromUsername from "../../data/user/getUserFromUsername"

const InviteArtistsModal = ({ approvedArtists, onInvite, isOpen, onClose }) => {
  const [newApproveArtists, setNewApprovedArtists] = useState(approvedArtists || [])
  console.log("🚀 ~ file: inviteArtistsModal.jsx:11 ~ InviteArtistsModal ~ newApproveArtists:", newApproveArtists)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  
  const handleInvite = () => {
    onInvite(newApproveArtists)
    onClose()
  }

  const useAddress = search.length >= 32

  const addDisabled = !search || newApproveArtists.find(user => user.username.toLowerCase() === search.toLowerCase()) 

  const handleSearch = async () => {
    if (addDisabled) return
    setError('')
    let artist;
    try {
      if (!useAddress) artist = await getUserFromUsername(search).then(res => res.user)
      // else artist = await getUserFromAddress(search) //TODO make this route (make sure it doesnt return sensitive info)
      if (!artist) throw new Error("No user returned from API")
    } catch (e) {
      console.log("Error getting user:", e)
      setError("User not found")
    }

    if (artist) {
      setNewApprovedArtists(prev => [...prev, artist])
      setSearch('')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Artists" widthClass="max-w-screen-md">

      <p className="text-center mt-6">Artists must have a Collector account</p>
 
      <div className="flex items-center justify-center gap-2 mt-3">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Add by username"//or address
          className="w-full max-w-lg"
          onEnter={handleSearch}
        />
        <MainButton
          onClick={handleSearch}
          noPadding
          className=" py-1.5 px-3"
          disabled={addDisabled}
        >
          Add
        </MainButton>
      </div>

      <p className="text-center text-sm mb-4 italic text-red-500 h-4 ">{error}</p>


      <div className="relative mx-auto w-fit">
        <p className="bg-neutral-200 dark:bg-neutral-700 h-6 font-bold">Approved Artists</p>
        <RoundedCurve className="absolute bottom-0 -left-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
        <RoundedCurve className="absolute bottom-0 -right-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700" />
      </div>
      <div className="mb-6 min-h-[5.5rem] border-4 rounded-xl p-2
       border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
       flex items-start flex-wrap gap-2
       ">
        {newApproveArtists.map((artist, i) => {
          return (
            <ArtistChip
              key={artist.username+i}
              name={artist.username}
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

const ArtistChip = ({ name, onRemove }) => { 
  return (
    <div className="flex items-center gap-1 rounded-lg pl-2 pr-1
    bg-white dark:bg-black
      border border-neutral-200 dark:border-neutral-700
    ">
      <p>{name}</p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 hover:scale-110 active:scale-100 duration-300">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
