import { useContext, useEffect, useMemo, useState } from "react";
import UserContext from "../contexts/user";
import CloudinaryImage from "../components/CloudinaryImage";
import MainButton from "../components/MainButton";

import CheckLoggedIn from "../components/CheckLoggedIn";
import { useRouter } from "next/router";
import MainNavigation from "../components/navigation/MainNavigation";
import SubmitArtModal from "../components/artistSubmissions/submitArtModal";
import getCurationsByApprovedArtist from "../data/curation/getCurationsByApprovedArtist";
import { submitEditionTokens, submitSingleToken, submitTokens } from "../data/curationListings/submitToken";
import { error, success } from "../utils/toast";
import EditListingsModal from "../components/artistSubmissions/editListingsModal";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import clsx from "clsx";
import { useMetadata } from "../data/nft/getMetadata";

const Submissions = ({ }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()

  const userTokens = useMetadata(user?.public_keys, {
    useArtistDetails: false,
    justVisible: false,
    justCreator: true
  });

  const [approvedCurations, setApprovedCurations] = useState([])
  const [curationToEdit, setCurationToEdit] = useState(null)
  const [editSubmissionsOpen, setEditSubmissionsOpen] = useState(false)
  const [editListingsOpen, setEditListingsOpen] = useState(false)

  const [loadingCurations, setLoadingCurations] = useState(true)

  useEffect(() => {
    if(!user) return
    if (!user.curator_approved) router.replace("/");
      
    (async () => {
      const curations = await getCurationsByApprovedArtist(user.id)
      setApprovedCurations(curations || [])
      setLoadingCurations(false)
    })()
  }, [user, router])

  const handleCloseModal = () => { 
    setEditSubmissionsOpen(false)
    setEditListingsOpen(false)
    setCurationToEdit(null)
  }

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

    if (res?.status !== "success" ) {
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


    return

    ///SINGLE
    const results = await Promise.allSettled(newTokens.map(async (token) => { 
      const isPrimarySale = !token.primary_sale_happened
      const res = await submitSingleToken({
        token,
        apiKey: user.api_key,
        curationId: curation.id,
        ownerId: user.id,
        artistId: isPrimarySale ? user.id : undefined,
        aspectRatio: token.aspectRatio, //aspectRatio added in the submitArtModal
      })

      if (res?.status === "success" && res?.listing) {
        return res.listing
      } else {
        error(`Failed to submit token ${ token.name } to ${ curation.name }`)
        return null
      } 
    }))

    const listings = results
      .filter(result => result.status === "fulfilled" && result.value)
      .reduce((acc, result) => { 
        const value = result.value
        if (Array.isArray(value)) acc.push(...value)
        else acc.push(value)
        return acc
      },[])

    if (listings.length) {
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
  }

  const handleEditListings = (newTokens, curation) => {
    setApprovedCurations(prev => prev.map(g => { 
      if (g.id !== curation.id) return g
      const newCuration = { ...g }
      const oldSubmitted = newCuration.submitted_token_listings || []
      const newSubmittedTokens = oldSubmitted.map(t => {
        const newToken = newTokens.find(nt => nt.mint === t.mint)
        return newToken || t
      })
      newCuration.submitted_token_listings = newSubmittedTokens

      setCurationToEdit(newCuration)
      return newCuration
    }))
  }

  return (
    <>
      <CheckLoggedIn />
      <MainNavigation />
      <Toaster />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 px-4">
          <h2 className="text-5xl font-bold">Approved Curations</h2>
        </div>
        
        <hr className="mt-6 mb-12 border-neutral-200 dark:border-neutral-800" />

        {loadingCurations ? <p className="text-center text-lg animate-pulse mt-20">Loading Curations...</p> : null}
        {!loadingCurations && !approvedCurations.length ? <p className="text-center text-lg mt-20">Sorry, No Curations Found</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          {approvedCurations.map(curation => {
            const { banner_image, name, id, curator, is_published } = curation
            const artistSubmissions = curation.submitted_token_listings.filter(listing => {
              const creatorsAddresses = listing.creators?.map((creator) => creator.address)
              const userKeys = user?.public_keys || []
              const isArtist = userKeys.includes(listing.artist_address) || Boolean(creatorsAddresses?.find(address => userKeys.includes(address)))
              const notSold = listing.listed_status !== "sold"
              return isArtist && notSold
            })
            return (
              <div key={id} className="relative">
                <Link href={`/curations/${ name }`} >
                  <a className={clsx(
                    !is_published && "pointer-events-none",
                    "relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden hover:-translate-y-3 duration-300 block"
                  )}>
                    <CloudinaryImage
                      className="w-full h-[300px] object-cover"
                      id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ banner_image }`}
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
          })}

        </div>
      </div>
      <SubmitArtModal
        isOpen={editSubmissionsOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        curation={curationToEdit}
        tokens={userTokens}
      />
      <EditListingsModal
        isOpen={editListingsOpen}
        onClose={handleCloseModal}
        handleEditListings={handleEditListings}
        curation={curationToEdit}
      />
    </>
  )
}

export default Submissions
