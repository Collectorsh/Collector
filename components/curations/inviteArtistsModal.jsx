import { useContext, useEffect, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { RoundedCurve } from "./roundedCurveSVG"
import SearchBar from "../SearchBar"
import getUserFromUsername from "../../data/user/getUserFromUsername"
import CopyButton from "../CopyToClipboard"
import Tippy from "@tippyjs/react"
import generateViewerPasscode from "../../data/curation/generateViewerPasscode"
import UserContext from "../../contexts/user"
import { host } from "../../config/settings"
import * as Icon from "react-feather"

const InviteArtistsModal = ({ approvedArtists, onInvite, isOpen, onClose, viewerPasscode, name }) => {

  const [user] = useContext(UserContext);

  const [newApproveArtists, setNewApprovedArtists] = useState(approvedArtists || [])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [passcode, setPasscode] = useState(viewerPasscode)

  useEffect(() => {
    if (!passcode) setPasscode(viewerPasscode)
  }, [viewerPasscode, passcode])
  
  const handleInvite = () => {
    if (!newApproveArtists?.length) return
    onInvite(newApproveArtists)
    handleClose({keepCurrent: true})
  }

  const handleClose = ({ keepCurrent } = { keepCurrent: false }) => { 
    onClose()
    setTimeout(() => {
      if(!keepCurrent) setNewApprovedArtists(approvedArtists || [])
      setSearch('')
      setError('')
    },500)
  }

  const addDisabled = !search || newApproveArtists.find(user => user.username?.toLowerCase() === search?.toLowerCase()) 

  const handleSearch = async () => {
    if (addDisabled) return
    setError('')
    try {
      const artist = await getUserFromUsername(search).then(res => res?.user)
      if (!artist?.username) {
        throw new Error("No user returned from API")
      } else {
        setNewApprovedArtists(prev => [...prev, artist])
        setSearch('')
      }
    } catch (e) {
      console.log("Error getting user:", e)
      setError("User not found")
    }
  }

  const handleGeneratePasscode = async () => {
    const passcode = await generateViewerPasscode({ apiKey: user.api_key, name });
    if (passcode) setPasscode(passcode)
  }

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${ host }/submissions/?passcode=${ passcode }`;
    } else return ""
  }

  const info = (
    <Tippy
      content="When an artist uses this link they will be automatically added to your curation"
      className="shadow"
    >
      <Icon.Info className="opacity-50" size={14} />
    </Tippy>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Artists" widthClass="max-w-screen-md">

      <div className="flex flex-col items-center mt-4">
        <p className="text-lg flex gap-1">
          Invite Link
          {info}
        </p>
        {passcode ? (
          <div className="flex items-center gap-2">
            <p className="text-sm textPalette2">{getUrl()}</p>
            <CopyButton textToCopy={getUrl()} />
          </div>
        ) : (
          <MainButton
            onClick={handleGeneratePasscode}
            className="mt-1"
            
          >
            Generate Link
          </MainButton>
        )}
        
      </div>

      <hr className="my-5 borderPalette3" />
 
      <div className="flex items-center justify-center gap-2">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Add by username or address"
          className="w-full max-w-lg"
          onEnter={handleSearch}
        />
        <MainButton
          onClick={handleSearch}
          className="flex gap-1.5 items-center"
          size="lg"
          disabled={addDisabled}
        >
          Add
          <Icon.Plus size={19} strokeWidth={2.5} />
        </MainButton>
      </div>

      <p className="text-center text-sm italic text-red-500 h-4 ">{error}</p>

      <p className="text-center mb-4 text-sm textPalette2">Artists must have a Collector account</p>

      <div className="relative mx-auto w-fit">
        <p className="bg-neutral-300 dark:bg-neutral-700 h-6 font-bold">Approved Artists</p>
        <RoundedCurve className="absolute bottom-0 -left-8 w-8 h-6 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1]" />
        <RoundedCurve className="absolute bottom-0 -right-8 w-8 h-6 fill-neutral-300 dark:fill-neutral-700" />
      </div>
      <div className="mb-6 min-h-[5.5rem] border-4 rounded-xl p-2
       border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
       flex items-start flex-wrap gap-2
       ">
        {newApproveArtists.map((artist, i) => {
          return (
            <ArtistChip
              key={artist.username+i}
              name={artist.username}
              onRemove={() => setNewApprovedArtists(prev => prev.filter(a => a.username !== artist.username))}
            />
          )
        })}
      </div>
      
      <div className="w-full flex justify-center gap-4">
        <MainButton onClick={handleClose} standardWidth size="lg">
          Cancel
        </MainButton>
        <MainButton onClick={handleInvite} solid disabled={!newApproveArtists?.length} standardWidth size="lg">
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
      palette1
      border border-neutral-300 dark:border-neutral-700
    ">
      <p>{name}</p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 duration-300">
        <Icon.X size={16} />
      </button>
    </div>
  )
}
