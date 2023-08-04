import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/user";
import MainNavigation from "../../components/navigation/MainNavigation";
import { Toaster } from "react-hot-toast";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import CloudinaryImage from "../../components/CloudinaryImage";
import EditDescriptionModal from "../../components/proGallery/editDescriptionModal";
import EditNameModal from "../../components/proGallery/editNameModal";
import EditBannerModal from "../../components/proGallery/editBannerModal";
import clsx from "clsx";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import DisplayModules from "../../components/proGallery/displayModules";
import GlobalEditBar from "../../components/proGallery/globalEditBar";
import { success } from "../../utils/toast";
import { shootConfetti } from "../../utils/confetti";
import { set } from "nprogress";
import PublishConfirmationModal from "../../components/proGallery/publishConfirmationModal";
import UnpublishConfirmationModal from "../../components/proGallery/unpublishConfirmationModal";
import InviteArtistsModal from "../../components/proGallery/inviteArtistsModal";

  //TODO: on isEditingDraft change, switch to draft gallery
  //TODO: if owner fetch draft gallery
  //TODO: if unpublished, display draft gallery
  //TODO: connect to websocket for listing updates
  

function ProGalleryPage({ gallery }) {
  const [user] = useContext(UserContext);

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);
  const [globalEditOpen, setGlobalEditOpen] = useState(false);
  const [inviteArtistsModalOpen, setInviteArtistsModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(!gallery?.is_published); //defaults to true if unpublished
  const [isPublished, setIsPublished] = useState(gallery?.is_published);
  const [bannerLoaded, setBannerLoaded] = useState(true);

  const [approvedArtists, setApprovedArtists] = useState(gallery?.approved_artists || []);
  const [name, setName] = useState(gallery?.name);
  const [publishedContent, setPublishedContent] = useState(gallery?.published_content);
  const [draftContent, setDraftContent] = useState(gallery?.draft_content);

  const isOwner = Boolean(user && user.public_keys.includes(gallery?.curator_address) && user.api_key);
 
  const useDraftContent = isEditingDraft && isOwner;
  const banner = useDraftContent ? draftContent?.banner_image : publishedContent?.banner_image;
  const description = useDraftContent ? draftContent?.description : publishedContent?.description;
  const modules = useDraftContent ? draftContent?.modules : publishedContent?.modules;

  const displayPublishedEdit = globalEditOpen && isOwner;
  const displayDraftEdit = globalEditOpen && useDraftContent;
  const displayGallery = Boolean(gallery?.is_published || isOwner);

  const hasChanges = JSON.stringify(draftContent) !== JSON.stringify(publishedContent);

  //TODO fetch draft content if isOwner
  // const draftContent = useDraftContent(gallery?.name, isOwner, user?.api_key);
  
  useEffect(() => {
    if (isOwner) {
      setGlobalEditOpen(true)
    }
  }, [isOwner, gallery?.is_published, gallery?.draft_content])

  useEffect(() => {
    if (!useDraftContent) return
    //set loaded to false when the banner changes
    if (banner !== publishedContent.banner_image) setBannerLoaded(false);
  }, [banner, publishedContent.banner_image, useDraftContent])

  const handlePublish = async () => { 
    //TODO API command that copies draft content to published content
    // const res = await PublishDraft(draftContent)
    //failed return false

    //delay for placeholder
    function fakeApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("API call completed!");
        }, 1000); // delay for 2 seconds
      });
    }
    await fakeApiCall()

    //await successfull response from API
    setPublishedContent(draftContent)
    setIsPublished(true)
    return true
  }

  const handleUnpublish = async () => { 
    //TODO API command that sets is_published to false
    setIsPublished(false)
    setIsEditingDraft(true)
  }

  const saveDraftContent = async (newContent) => { 
    if(!newContent || !isOwner) return
    console.log("UPDATE CONTENT PLACEHOLDER")

    //TODO create update draft content API route
    // const res = await updateGalleryDraftContent(user.api_key, gallery.name, newContent)
    // if (res.status === "success") success("Gallery Content Updated!")
    // else error("Gallery Content update failed")
  }

  const handleInviteArtists = async (newArtists) => { 
    //TODO API command that updates approved artists list

    setApprovedArtists(newArtists)
  }

  const handleEditName = async (newName) => {
    if (!isOwner) return;
    setName(newName);

    //TODO create update Name API route
    // const res = await updateGalleryName(user.api_key, newName)
    // if (res.status === "success") success("Gallery Name Updated!")
    // else error("Gallery Name update failed")
    //router.replace(`/pro/${ newName }`)
  }

  const handleEditDescription = (newDescription) => {
    if (!isOwner) return;
    setDraftContent(prev => {
      const newContent = {
        ...prev,
        description: newDescription
      }
      saveDraftContent(newContent)
      return newContent
    });
  }

  const handleEditBanner = (newToken) => { 
    if (!isOwner) return;
    setDraftContent(prev => {
      const newContent = {
        ...prev,
        banner: newToken.mint
      }
      saveDraftContent(newContent)
      return newContent
    });
  }

  const handleEditModules = (setModulesCB) => {
    if (!isOwner) return;
    
    setDraftContent(prev => {
      const newModules = typeof setModulesCB === "function"
        ? setModulesCB(prev.modules)
        : setModulesCB
      
      const newContent = {
        ...prev,
        modules: newModules
      }
      saveDraftContent(newContent)
      return newContent
    })

  }

  if (!displayGallery) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <p className="dark:text-gray-100 pt-20 text-center">Sorry, we could not find a Pro Gallery with that name</p>
      </div>
    </>
  )

  return (
    <>
      <Toaster />
      <MainNavigation />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
        <EditWrapper
          isOwner={displayDraftEdit}
          onEdit={() => setEditBannerOpen(true)}
          placement="inside-tr"
          groupHoverClass="group-hover/banner:opacity-100"
        // icon={<PhotographIcon className="w-6 h-6" />}
        >
          <div className="w-full pb-[50%] md:pb-[33%] relative">
            {banner ? (
              <CloudinaryImage
                className={clsx(
                  "absolute inset-0 w-full h-full object-cover 2xl:rounded-b-2xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25",
                  !bannerLoaded && "animate-pulse"
                )}
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ banner }`}
                noLazyLoad
                onLoad={() => setBannerLoaded(true)}
                // width={2000}
              />
            ) : (
              <div className="absolute inset-0 w-full h-full object-cover 2xl:rounded-b-2xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25 flex justify-center items-center">
                <p className="font-xl font-bold">Click the edit button in the top right to add a banner</p>
              </div>
            )}
          </div>
        </EditWrapper>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
       
        <div className="group/name w-fit mb-2 mx-auto">
          <EditWrapper
            isOwner={displayPublishedEdit}
            onEdit={() => setEditNameOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/name:opacity-100"
          // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <h1 className="font-bold text-5xl">{name.replaceAll("_", " ")}</h1>
          </EditWrapper>
        </div>
        <Link href={`/profile/${ gallery.curator.username }`} >
          <a className="flex gap-2 items-center justify-center mb-8">
            <p className="text-lg">Curated by {gallery.curator.username}</p>
            <CloudinaryImage
              className={clsx(
                "w-16 h-16 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800 border-8 border-white dark:border-black",
              )}
              id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ gallery.curator.profile_image }`}
              noLazyLoad
              width={144}
              height={144}
            />
          </a>
        </Link>
  
        <div className="group/description w-fit mx-auto">
          <EditWrapper
            isOwner={displayDraftEdit}
            onEdit={() => setEditDescriptionOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/description:opacity-100"
          // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <p className="whitespace-pre-wrap text-center">{description}</p>
          </EditWrapper>
        </div>

        <hr className="my-12 border-neutral-200 dark:border-neutral-800" />

        <DisplayModules
          modules={modules}
          isOwner={displayDraftEdit}
          setModules={handleEditModules}
          submittedTokens={gallery.submitted_tokens}
        />

        {isOwner
          ? (
            <GlobalEditBar
              isOpen={globalEditOpen}
              setOpen={setGlobalEditOpen}
              setModules={handleEditModules}
              handleInviteArtists={() => setInviteArtistsModalOpen(true)}
              handlePublish={() => setPublishModalOpen(true)}
              handleUnpublish={() => setUnpublishModalOpen(true)}
              isEditingDraft={isEditingDraft}
              setIsEditingDraft={setIsEditingDraft}
              hasChanges={hasChanges}
              isPublished={isPublished}
            />
          )
          : null
        }
      </div>
      {isOwner
        ? (
          <>
            <EditNameModal
              isOpen={editNameOpen}
              onClose={() => setEditNameOpen(false)}
              onSave={handleEditName}
              name={name}
            />
            <EditDescriptionModal
              isOpen={editDescriptionOpen}
              onClose={() => setEditDescriptionOpen(false)}
              onSave={handleEditDescription}
              description={description}
            />
            <EditBannerModal
              isOpen={editBannerOpen}
              onClose={() => setEditBannerOpen(false)}
              onSave={handleEditBanner}
              submittedTokens={gallery.submitted_tokens}
            />
            <PublishConfirmationModal
              isPublished={isPublished}
              name={name}
              isOpen={publishModalOpen}
              onClose={() => setPublishModalOpen(false)}
              onPublish={handlePublish}
              onViewPublished={() => setIsEditingDraft(false)}
            />
            <UnpublishConfirmationModal
              name={name}
              isOpen={unpublishModalOpen}
              onClose={() => setUnpublishModalOpen(false)}
              onUnpublish={handleUnpublish}
            />
            <InviteArtistsModal
              isOpen={inviteArtistsModalOpen}
              onClose={() => setInviteArtistsModalOpen(false)}
              onInvite={handleInviteArtists}
              approvedArtists={approvedArtists}
            />
          </>
        )
        : null
      }
    </>
  )
}



export async function getServerSideProps(context) {
  try {
    ////Mocking Galleries
    const content = {
      description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
      banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      modules: [
        {
          id: uuidv4(),
          type: "text", textDelta: JSON.stringify({ "ops": [{ "insert": "This is a text block" }] })
        },
        {
          id: uuidv4(),
          type: "art", tokens: [
            {
              mint: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
              name: "hoops", price: 10, artist: "EV3",
              aspect_ratio: 1.7985611511
            },
            {
              mint: "3Utt2yZdMyEX1wrrsrAbuVSweft1JVi8GwiuSP1U5r2G",
              name: "test with a long name", price: 0, artist: "EV3 with a long name",
              aspect_ratio: 0.6093313357
            }
          ]
        },
      ]
    }

    const gallery = {
      id: 1,
      curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
      name: "Hoops_Gallery",
      // approved_artists: [ //probable will be joined with artists from users table
      //   {
      //     artist_address:
      //     username:
      //   }
      // ],
      submitted_tokens: [
        {
          mint: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
          name: "hoops", price: 10, artist: "EV3",
          aspect_ratio: 1.7985611511
        },
        {
          mint: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
          name: "test", price: 20.696969, artist: "EV3",
          aspect_ratio: 1
        },
        {
          mint: "3Utt2yZdMyEX1wrrsrAbuVSweft1JVi8GwiuSP1U5r2G",
          name: "test with a long name", price: 0, artist: "EV3 with a long name",
          aspect_ratio: 0.6093313357
        },
        {
          mint: "HGqeUWQkq37K2KqkJTtA3JUqRrDibuWcwyULFiBqSUfb",
          name: "clouds", price: 420.69, artist: "artists name",
          aspect_ratio: 1.7777777778
        },
        {
          mint: "BkvVPbb13FEj6h7AqX3ENR1ppzjYcANfxh7NGUzHAxZw",
          name: "mask", price: 40, artist: "artists name2",
          aspect_ratio: 0.6666666667
        },
        {
          mint: "BGkSrHa3ikiHpNiSqnEwJkoARh7BP2yQvk9HsRAqCdm9",
          name: "photo", price: 0, artist: "artists name5",
          aspect_ratio: 1.5,
        },
        {
          mint: "EDtDEFjtLDrC3cB5eagihfFYS8Dq9WtsfdL6Cx2YPGNB",
          name: "video", price: 100, artist: "Pips",
          aspect_ratio: 1, animation_url: "https://arweave.net/YoRtjMdbBmo0E-aKMWP51kve1xcUGyAYwI2jlGwR1lY?ext=mp4"
        }
      ],
      is_published: true,
      draft_content: content,
      published_content: content,
      curator: {
        username: "EV3",
        profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
      },
    }

    // const gallery_name = context.params.gallery_name;
    // const res = await getProGallery(gallery_name)
    // const gallery = res.gallery;

    if (gallery) {
      return { props: { gallery } };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default ProGalleryPage;