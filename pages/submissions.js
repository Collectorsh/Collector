import { useContext, useEffect, useMemo, useState } from "react";
import UserContext from "../contexts/user";
import CloudinaryImage from "../components/CloudinaryImage";
import MainButton from "../components/MainButton";

import CheckLoggedIn from "../components/CheckLoggedIn";
import { useRouter } from "next/router";
import MainNavigation from "../components/navigation/MainNavigation";
import SubmitArtModal from "../components/artistSubmissions/submitArtModal";
import getCurationsByApprovedArtist from "../data/curation/getCurationsByApprovedArtist";
import submitToken from "../data/curationListings/submitToken";
import { error, success } from "../utils/toast";
import EditListingsModal from "../components/artistSubmissions/editListingsModal";
import { Toaster } from "react-hot-toast";

const Submissions = ({ }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()

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
    const results = await Promise.allSettled(newTokens.map(async(token) => { 
      const isPrimarySale = !token.primarySaleHappened
      const res = await submitToken({
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
        error(`Failed to submit token ${ token.name } to gallery ${ curation.name }`)
        return null
      }
    }))

    const listings = results
      .filter(result => result.status === "fulfilled" && result.value)
      .map(result => result.value);

    if (listings.length) {
      success(`Successfully submitted ${ listings.length } tokens to gallery ${ curation.name }`)
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

  const handleEditListing = (newToken, curation) => {
    setApprovedCurations(prev => prev.map(g => { 
      if (g.id !== curation.id) return g
      const newCuration = { ...g }
      const oldSubmitted = newCuration.submitted_token_listings || []
      const newSubmittedTokens = oldSubmitted.map(t => t.mint === newToken.mint ? newToken : t)
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
            const { banner_image, name, id, curator } = curation
            const artistSubmissions = curation.submitted_token_listings.filter(listing => user?.public_keys.includes(listing.artist_address))
            return (
              <div key={id} className="relative">
                <div className="relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden">
                  <CloudinaryImage
                    className="w-full h-[300px] object-cover"
                    id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ banner_image }`}
                    noLazyLoad
                    width={1400}
                  />
                </div>
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
      />
      <EditListingsModal
        isOpen={editListingsOpen}
        onClose={handleCloseModal}
        handleEditListing={handleEditListing}
        curation={curationToEdit}
      />
    </>
  )
}

export default Submissions

// function mockGetApprovedCurations(userID) { //Mock API
//   if (!userID) return []

//   try {
//     ////Mocking Galleries
//     const curator = {
//       username: "Test Curator",
//       profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",

//     }
//     const curations = [
//       {
//         id: 1,
//         curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
//         curator_fee: 20,
//         curator: curator,
//         name: "Hoops Gallery",
//         description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
//         is_published: true,
//         banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
//       },
//       {
//         id: 2,
//         curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
//         curator: curator,
//         curator_fee: 20,
//         name: "Abstract StuffG",
//         description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
//         is_published: true,
//         banner_image: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
//       },
//       {
//         id: 3,
//         curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
//         curator: curator,
//         curator_fee: 20,
//         name: "Photography Exhibit",
//         description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
//         is_published: true,
//         banner_image: "86Umq7881f1QXpr91B1jPjpGMYu3CeZFFx4Rt25u5K24",
//       },
//       {
//         id: 4,
//         curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
//         curator: curator,
//         curator_fee: 20,
//         name: "Hoops Gallery Old",
//         description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
//         is_published: false,
//         banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
//       },
//     ]

//     // const gallery_name = context.params.gallery_name;
//     const curations = await getcurationsByApprovedArtist(userId);
  

//     return curations
//   } catch (err) {
//     console.log(err);
//     return []
//   }
// }