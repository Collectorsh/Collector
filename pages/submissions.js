import { useContext, useEffect, useMemo, useState } from "react";
import UserContext from "../contexts/user";
import CloudinaryImage from "../components/CloudinaryImage";
import MainButton from "../components/MainButton";

import CheckLoggedIn from "../components/CheckLoggedIn";
import { useRouter } from "next/router";
import MainNavigation from "../components/navigation/MainNavigation";
import SubmitArtModal from "../components/artistSubmissions/submitArtModal";
import getCurationsByApprovedArtist from "../data/curation/getCurationsByApprovedArtist";
import { submitTokens } from "../data/curationListings/submitToken";
import { error, success } from "../utils/toast";
import EditListingsModal from "../components/artistSubmissions/editListingsModal";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import clsx from "clsx";
import { useTokens } from "../data/nft/getTokens";
import { parseCloudImageId } from "../utils/cloudinary/idParsing";
import { curationListPlaceholderId } from "../components/curatorProfile/curationList";
import { addSelfApprovedArtists } from "../data/curation/updateApprovedArtists";
import "tippy.js/dist/tippy.css";


const Submissions = ({ }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()

  const userTokens = useTokens(user?.public_keys, {
    useArtistDetails: false,
    justVisible: false,
    justCreator: true,
    useTokenMetadata: true,
    filterOutCollections: true,
  });

  const [approvedCurations, setApprovedCurations] = useState([])
  const [curationToEdit, setCurationToEdit] = useState(null)
  const [editSubmissionsOpen, setEditSubmissionsOpen] = useState(false)
  const [editListingsOpen, setEditListingsOpen] = useState(false)

  const [loadingCurations, setLoadingCurations] = useState(true)

  const viewerPasscodeQuery = router.query?.passcode;

  const submissionMints = useMemo(() => { 
    const mints = new Set()
    approvedCurations?.forEach(curation => { 
      curation?.submitted_token_listings?.forEach(listing => { 
        mints.add(listing.mint)
      })
    })
    return Array.from(mints)
  }, [approvedCurations])

  useEffect(() => {
    if (!user) {
      setApprovedCurations([])
      setLoadingCurations(true)
      setEditSubmissionsOpen(false)
      setEditListingsOpen(false)
      setCurationToEdit(null)
    }
  }, [user])

  useEffect(() => {
    if(!user) return
    (async () => {
      const curations = await getCurationsByApprovedArtist(user.id)
      setApprovedCurations(curations || [])
      setLoadingCurations(false)
    })()
  }, [user, router])

  useEffect(() => {
    if (!user || !viewerPasscodeQuery) return;

    (async () => {
      const res = await addSelfApprovedArtists({
        apiKey: user.api_key,
        viewerPasscode: viewerPasscodeQuery
      })

      if (res?.status !== "success") {
        error("Failed to approve new curation")
      } else if(res.curation) {
        success(`Successfully approved for ${ res.curation.name }`)
        setApprovedCurations(prev => [res.curation, ...prev])
      }
    })();
  }, [user, viewerPasscodeQuery])

  const handleOpenSubmitModal = (curation) => { 
    setCurationToEdit(curation)
    setEditSubmissionsOpen(true)
  }
  const handleOpenListingsModal = (curation) => { 
    setCurationToEdit(curation)
    setEditListingsOpen(true)
  }

  const handleSubmit = async (curation, newTokens) => {
    const res = await submitTokens({
      tokens: newTokens,
      apiKey: user.api_key,
      curationId: curation.id,
      ownerId: user.id,
    })

    if (res?.status !== "success") {
      error(`Failed to submit tokens to ${ curation.name }`)
    } else {
      const listings = res.listings
      success(`Successfully submitted ${ listings.length } piece(s) to ${ curation.name }`)
      setApprovedCurations(prev => {
        const newCuration = prev.find(g => g.id === curation.id)
        if (!newCuration) return prev
        if (newCuration.submitted_token_listings) newCuration.submitted_token_listings.push(...listings)
        else newCuration.submitted_token_listings = listings
  
        setCurationToEdit(newCuration)
        const newCurations = prev.map(g => g.id === curation.id ? newCuration : g)
        return newCurations
      })
    }
    setEditListingsOpen(true)
  }

  const handleEditListings = (newToken, curation) => {
    setApprovedCurations(prev => prev.map(g => { 
      if (g.id !== curation.id) return g
      const newCuration = { ...g }
      const oldSubmitted = newCuration.submitted_token_listings || []
      const newSubmittedTokens = oldSubmitted.map(t => {
        return newToken.mint === t.mint ? newToken : t
      })
      newCuration.submitted_token_listings = newSubmittedTokens

      setCurationToEdit(newCuration)
      return newCuration
    }))
  }

  const handleRemoveListing = (token, curation) => {
    setApprovedCurations(prev => prev.map(g => { 
      if (g.id !== curation.id) return g
      const newCuration = { ...g }
      const oldSubmitted = newCuration.submitted_token_listings || []
      const newSubmittedTokens = oldSubmitted.filter(t => {
        return token.mint !== t.mint
      })
      newCuration.submitted_token_listings = newSubmittedTokens

      setCurationToEdit(newCuration)
      return newCuration
    }))
  }

  const curationElements = useMemo(() => {
    return approvedCurations.map(curation => {
      const { banner_image, name, id, curator, is_published } = curation

      const bannerImgId = parseCloudImageId(banner_image)

      const artistSubmissions = curation.submitted_token_listings.filter(listing => {
        const creatorsAddresses = listing.creators?.map((creator) => creator.address)
        const userKeys = user?.public_keys || []
        const isArtist = userKeys.includes(listing.artist_address) || creatorsAddresses?.some(address => userKeys.includes(address))
        const isMasterEdition = listing.is_master_edition
        const notSold = isMasterEdition
          ? listing.listed_status !== "master-edition-closed"
          : listing.listed_status !== "sold"
        return isArtist && notSold
      })

      const passcodeQuery = curation.viewer_passcode ? `?passcode=${ curation.viewer_passcode }` : ""
      return (
        <div key={id} className="relative">
          <Link href={`/curations/${ name }${ passcodeQuery }`} >
            <a className={clsx(

              "relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden hover:-translate-y-3 duration-300 block"
            )}>
              <CloudinaryImage
                className="w-full h-[300px] object-cover"
                id={bannerImgId || curationListPlaceholderId}
                noLazyLoad
                width={1400}
              />
            </a>
          </Link>
          <div className="my-2 px-3 gap-3 flex justify-between flex-wrap">
            <div>
              <h3 className="font-bold collector text-2xl">{name.replaceAll("_", " ")}</h3>
              <p>Curated by {curator.username}</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              {artistSubmissions.length
                ? (
                  <MainButton
                    noPadding
                    className="px-3 py-1 flex gap-1 items-center"
                    disabled={!artistSubmissions.length}
                    onClick={() => handleOpenListingsModal(curation)}
                  >
                    Edit Listings
                  </MainButton>
                )
                : null}
              <MainButton
                solid noPadding className="px-3 py-1"
                onClick={() => handleOpenSubmitModal(curation)}
              >
                Submit Art
              </MainButton>
            </div>
          </div>
        </div>
      )
    })
  }, [approvedCurations, user?.public_keys])

  return (
    <>
      <MainNavigation />
      <Toaster />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 px-4">
          <h2 className="text-5xl font-bold">Approved Curations</h2>
          <Link href="/create" passHref>
            <MainButton solid disabled={!approvedCurations?.length}>
              Create
            </MainButton>
          </Link>
        </div>
        
        <hr className="mt-6 mb-12 border-neutral-200 dark:border-neutral-800" />

        {!user ? <p className="text-center text-lg mt-20">Please connect wallet to continue</p> : null}

        {user && loadingCurations ? <p className="text-center text-lg animate-pulse mt-20">Loading Curations...</p> : null}
        {user && !loadingCurations && !approvedCurations.length ? <p className="text-center text-lg mt-20">Sorry, No Curations Found</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          {user
            ? curationElements
            : null
          }

        </div>
      </div>
      {user && user.curator_approved
        ? (
          <>
            <SubmitArtModal
              isOpen={editSubmissionsOpen}
              // onClose={handleCloseModal}
              onClose={() => setEditSubmissionsOpen(false)}
              onSubmit={handleSubmit}
              curation={curationToEdit}
              tokens={userTokens}
              submissionMints={submissionMints}
            />
            <EditListingsModal
              isOpen={editListingsOpen}
              // onClose={handleCloseModal}
              onClose={() => setEditListingsOpen(false)}
              handleEditListings={handleEditListings}
              handleRemoveListing={handleRemoveListing}
              curation={curationToEdit}
            />
          </>
        )
        : null}
    </>
  )
}

export default Submissions
