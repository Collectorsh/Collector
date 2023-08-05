import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import CloudinaryImage from "../components/CloudinaryImage";
import MainButton from "../components/MainButton";
import { CogIcon } from "@heroicons/react/solid";
import CheckLoggedIn from "../components/CheckLoggedIn";
import { useRouter } from "next/router";
import MainNavigation from "../components/navigation/MainNavigation";
import SubmitArtModal from "../components/artistSubmissions/submitArtModal";

const Submissions = ({ }) => {
  const [user] = useContext(UserContext);
  const router = useRouter()

  const [approvedGalleries, setApprovedGalleries] = useState([])
  const [galleryToEdit, setGalleryToEdit] = useState(null)

  useEffect(() => {
    if(!user) return
    // if (!user.curator_approved) router.push("/")
    (async () => {
      const galleries = await getApprovedGalleries(user.id)
      setApprovedGalleries(galleries)
    })()
  }, [user])

  const handleCloseSubmitModal = () => {
    setGalleryToEdit(null)
  }

  const handleSubmit = (gallery, newTokens) => {
    //TODO: API call to submit tokens to galleries "submitted_tokens"
    setApprovedGalleries(prev => {
      const newGallery = prev.find(g => g.id === gallery.id)
      if (!newGallery) return prev
      if(newGallery.submitted_tokens) newGallery.submitted_tokens.push(...newTokens)
      else newGallery.submitted_tokens = newTokens
      return prev.map(g => g.id === gallery.id ? newGallery : g)
    })
  }

  return (
    <>
      <CheckLoggedIn />
      <MainNavigation />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 py-12">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-5xl font-bold">Approved Curations</h2>
          <MainButton className="px-3 py-1 flex gap-1 items-center">
            <CogIcon className="w-5 h-5" />
            <spam>Edit Submission Listings</spam>
          </MainButton>
        </div>
        
        <hr className="mt-6 mb-12 border-neutral-200 dark:border-neutral-800" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          {approvedGalleries.map(gallery => {
            const { banner_image, name, id, curator } = gallery
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
                <div className="my-2 pl-2 flex justify-between">
                  <div>
                    <h3 className="font-bold collector text-2xl">{name.replaceAll("_", " ")}</h3>
                    <p>Curated by {curator.username}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MainButton
                      solid noPadding className="px-3 py-1"
                      onClick={() => setGalleryToEdit(gallery)}
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
        isOpen={Boolean(galleryToEdit)}
        onClose={handleCloseSubmitModal}
        onSubmit={handleSubmit}
        gallery={galleryToEdit}
      />
    </>
  )
}

export default Submissions

function getApprovedGalleries(userID) { //Mock API
  if (!userID) return []

  try {
    ////Mocking Galleries
    const curator = {
      username: "Test Curator",
      profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
    }
    const galleries = [
      {
        id: 1,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        curator: curator,
        name: "Hoops Gallery",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        is_published: true,
        banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      },
      {
        id: 2,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        curator: curator,
        name: "Abstract StuffG",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        is_published: true,
        banner_image: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
      },
      {
        id: 3,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        curator: curator,
        name: "Photography Exhibit",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        is_published: true,
        banner_image: "86Umq7881f1QXpr91B1jPjpGMYu3CeZFFx4Rt25u5K24",
      },
      {
        id: 4,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        curator: curator,
        name: "Hoops Gallery Old",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        is_published: false,
        banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      },
    ]

    // const gallery_name = context.params.gallery_name;
    // const res = await getGalleriesByApprovedArtist(userId); get description and banner_image from puiblished_content or draft_content , join curator of curator_address
    // const galleries = res.galleries;

    return galleries
  } catch (err) {
    console.log(err);
    return []
  }
}