import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/user";
import MainNavigation from "../../components/navigation/MainNavigation";
import { Toaster } from "react-hot-toast";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import CloudinaryImage from "../../components/CloudinaryImage";
import EditDescriptionModal from "../../components/curations/editDescriptionModal";
import EditNameModal from "../../components/curations/editNameModal";
import EditBannerModal from "../../components/curations/editBannerModal";
import clsx from "clsx";
import Link from "next/link";
import DisplayModules from "../../components/curations/displayModules";
import GlobalEditBar from "../../components/curations/globalEditBar";;
import PublishConfirmationModal from "../../components/curations/publishConfirmationModal";
import UnpublishConfirmationModal from "../../components/curations/unpublishConfirmationModal";
import InviteArtistsModal from "../../components/curations/inviteArtistsModal";
import getCurationByName from "../../data/curation/getCurationByName";
import getPrivateContent from "../../data/curation/getPrivateContent";
import publishContent, { unpublishContent } from "../../data/curation/publishContent";
import { success, error } from "../../utils/toast";
import updateApprovedArtists from "../../data/curation/updateApprovedArtists";
import updateCurationName from "../../data/curation/updateCurationName";
import useActionCable from "../../hooks/useWebsocket";
import saveDraftContent from "../../data/curation/saveDraftContent";
import { useRouter } from "next/router";
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse";
import withdrawFromTreasury from "../../data/curation/withdrawFromTreasury";
import { roundToPrecision } from "../../utils/maths";


const descriptionPlaceholder = "Tell us about this curation."

function CurationPage({ curation }) {
  console.log("🚀 ~ file: [curation_name].js:34 ~ CurationPage ~ curation:", curation)
  const [user] = useContext(UserContext);
  const router = useRouter();
  const { handleBuyNowPurchase, collectedFees } = useCurationAuctionHouse(curation)

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);
  const [globalEditOpen, setGlobalEditOpen] = useState(false);
  const [inviteArtistsModalOpen, setInviteArtistsModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(!curation?.is_published); //defaults to true if unpublished
  const [isPublished, setIsPublished] = useState(curation?.is_published);
  const [bannerLoaded, setBannerLoaded] = useState(true);

  const [submittedTokens, setSubmittedTokens] = useState(curation?.submitted_token_listings || []);
  const [approvedArtists, setApprovedArtists] = useState(curation?.approved_artists || []);
  const [name, setName] = useState(curation?.name);
  const [publishedContent, setPublishedContent] = useState(curation?.published_content);
  const [draftContent, setDraftContent] = useState(null);
  const [privateKeyHash, setPrivateKeyHash] = useState(null);
  console.log("🚀 ~ file: [curation_name].js:55 ~ CurationPage ~ privateKeyHash:", privateKeyHash)

  const isOwner = Boolean(user && user.api_key && user.public_keys.includes(curation?.curator.public_keys[0]));
 
  const useDraftContent = isEditingDraft && isOwner;
  const banner = useDraftContent ? draftContent?.banner_image : publishedContent?.banner_image;
  const description = useDraftContent
    ? draftContent?.description || descriptionPlaceholder
    : publishedContent?.description;
  
  const modules = useDraftContent ? draftContent?.modules : publishedContent?.modules;

  const displayPublishedEdit = globalEditOpen && isOwner;
  const displayDraftEdit = globalEditOpen && useDraftContent;
  const displayCuration = Boolean(curation?.is_published || isOwner);

  const hasChanges = JSON.stringify(draftContent) !== JSON.stringify(publishedContent);

  const handleWebsocketMessages = useCallback(({ message, data }) => {
    switch (message) {
      case "Listing Update": {
        const { mint, listed_status, buy_now_price, listing_receipt } = data;
        setSubmittedTokens((prev) => prev.map((token) => { 
          return token.mint === mint
            ? { ...token, listed_status, buy_now_price, listing_receipt }
            : token
          })
        )
        break;
      }
    }
  }, [])

  const socketId = curation?.name ? `listings_${ curation.name }` : null
  useActionCable(socketId, { received: handleWebsocketMessages })

  useEffect(() => {
    if (isOwner && curation?.name) {
      (async () => {
        const { draft_content, private_key_hash } = await getPrivateContent({
          name: curation.name,
          apiKey: user.api_key
        })
        setDraftContent(draft_content)
        setPrivateKeyHash(private_key_hash)
        setGlobalEditOpen(true)
      })()
    }
  }, [isOwner, curation?.name, user?.api_key])

  useEffect(() => {
    if (!useDraftContent || !publishContent.banner_image) return
    //set loaded to false when the banner changes
    if (banner !== publishedContent.banner_image) setBannerLoaded(false);
  }, [banner, publishedContent?.banner_image, useDraftContent])

  const handlePublish = async () => { 
    if (!isOwner) return;

    const res = await publishContent({
      draftContent: draftContent,
      apiKey: user.api_key,
      name: curation.name
    })
    if (res?.status === "success") { 
      setPublishedContent(draftContent)
      setIsPublished(true)
      return true
    }
    return false //publishConfirmationModal handles success/error
  }

  const handleUnpublish = async () => { 
    if (!isOwner) return;

    const res = await unpublishContent({
      apiKey: user.api_key,
      name: curation.name
    })
    if (res?.status === "success") { 
      setIsPublished(false)
      setIsEditingDraft(true)
      success(`${curation.name} is unpublished`)
    } else {
      error(`${curation.name} unpublish failed`)
    }
  }

  const handleSaveDraftContent = async (newContent) => { 
    if (!newContent || !isOwner) return
    
    const res = await saveDraftContent({
      draftContent: newContent,
      apiKey: user.api_key,
      name: curation.name
    })

    if (res?.status !== "success") error("Content update failed")
  }

  const handleInviteArtists = async (newArtists) => { 
    setApprovedArtists(newArtists)

    const res = await updateApprovedArtists({
      artistIds: newArtists.map((artist) => artist.id),
      apiKey: user.api_key,
      name: curation.name
    })

    if (res?.status !== "success") error("Artist invitation failed")
  }

  const handleEditName = async (newName) => {
    if (!isOwner) return;
    setName(newName);

    const res = await updateCurationName({
      newName: newName,
      apiKey: user.api_key,
      name: curation.name,
    })

    if (res?.status === "success") {
      success(`${ newName } updated!`)
      //TODO: check this url replace doesnt mess with state
      router.replace(`/curations/${ newName }`)
    } else {
      error(`${ curation.name } name update failed`)
    }
  }

  const handleEditDescription = (newDescription) => {
    if (!isOwner) return;
    setDraftContent((prev) => {
      const newContent = {
        ...prev,
        description: newDescription
      }
      handleSaveDraftContent(newContent)
      return newContent
    });
  }

  const handleEditBanner = (newToken) => { 
    if (!isOwner) return;
    setDraftContent(prev => {
      const newContent = {
        ...prev,
        banner_image: newToken.mint
      }
      handleSaveDraftContent(newContent)
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
      handleSaveDraftContent(newContent)
      return newContent
    })

  }

  const handleWithdrawFees = async () => {
    if (!isOwner || !privateKeyHash) return;
    const res = await withdrawFromTreasury({
      privateKeyHash,
      curation,
    })

    if (res?.status === "success") {
      success(`Successfully withdrew ${ roundToPrecision(res.withdrawn, 2) } SOL!`)
    } else {
      error(`Withdrawal failed`)
    }
  }

  if (isOwner && !draftContent && !publishedContent) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <p className="dark:text-gray-100 pt-20 text-center animate-pulse">Loading...</p>
      </div>
    </>
  )
  if (!displayCuration) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <p className="dark:text-gray-100 pt-20 text-center">Sorry, we could not find a Curation with that name</p>
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
       
        <div className="group/name w-fit mb-3 mx-auto">
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
        <Link href={`/profile/${ curation.curator.username }`} >
          <a className="flex gap-2 items-center justify-center mb-8 hover:scale-105 duration-300 w-fit mx-auto">
            <p className="text-lg">Curated by {curation.curator.username}</p>
            {curation.curator.profile_image
              ? (<CloudinaryImage
                className={clsx(
                  "w-14 h-14 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800",
                )}
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ curation.curator.profile_image }`}
                noLazyLoad
                width={144}
              />)
              : null
            }
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
          submittedTokens={submittedTokens}
          approvedArtists={approvedArtists}
          handleBuyNowPurchase={handleBuyNowPurchase}
        />

        {isOwner
          ? (
            <GlobalEditBar
              isOpen={globalEditOpen}
              setOpen={setGlobalEditOpen}
              setModules={handleEditModules}
              handleInviteArtists={() => setInviteArtistsModalOpen(true)}
              openPublish={() => setPublishModalOpen(true)}
              openUnpublish={() => setUnpublishModalOpen(true)}
              isEditingDraft={isEditingDraft}
              setIsEditingDraft={setIsEditingDraft}
              hasChanges={hasChanges}
              isPublished={isPublished}
              noContent={modules.length === 0 || !banner}
              collectedFees={collectedFees}
              handleWithdrawFees={handleWithdrawFees}
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
              submittedTokens={submittedTokens}
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
    // const content = {
    //   description: "Curation Description goes here, where you can talk all about why you made this curation and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the curation it self",
    //   banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
    //   modules: [
    //     {
    //       id: uuidv4(),
    //       type: "text", textDelta: JSON.stringify({ "ops": [{ "insert": "This is a text block" }] })
    //     },
    //     {
    //       id: uuidv4(),
    //       type: "art", tokens: ["24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24","3Utt2yZdMyEX1wrrsrAbuVSweft1JVi8GwiuSP1U5r2G"]
    //     },
    //   ]
    // }

    // const curation = {
    //   id: 1,
    //   curator_id: 1,
    //   name: "Hoops_curation",
    //   // approved_artists: [ //probable will be joined with artists from users table
    //   //   {
    //   //     artist_address:
    //   //     username:
    //   //   }
    //   // ],
    //  submitted_token_listings: [
    //     {
    //       mint: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
    //       name: "hoops", buy_now_price: 10, artist_name: "EV3",
    //       aspect_ratio: 1.7985611511
    //     },
    //     {
    //       mint: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
    //       name: "test", buy_now_price: 20.696969, artist_name: "EV3",
    //       aspect_ratio: 1
    //     },
    //     {
    //       mint: "3Utt2yZdMyEX1wrrsrAbuVSweft1JVi8GwiuSP1U5r2G",
    //       name: "test with a long name", buy_now_price: 0, artist_name: "EV3 with a long name",
    //       aspect_ratio: 0.6093313357
    //     },
    //     {
    //       mint: "HGqeUWQkq37K2KqkJTtA3JUqRrDibuWcwyULFiBqSUfb",
    //       name: "clouds", buy_now_price: 420.69, artist_name: "artists name",
    //       aspect_ratio: 1.7777777778
    //     },
    //     {
    //       mint: "BkvVPbb13FEj6h7AqX3ENR1ppzjYcANfxh7NGUzHAxZw",
    //       name: "mask", buy_now_price: 40, artist_name: "artists name2",
    //       aspect_ratio: 0.6666666667
    //     },
    //     {
    //       mint: "BGkSrHa3ikiHpNiSqnEwJkoARh7BP2yQvk9HsRAqCdm9",
    //       name: "photo", buy_now_price: 0, artist_name: "artists name5",
    //       aspect_ratio: 1.5,
    //     },
    //     {
    //       mint: "EDtDEFjtLDrC3cB5eagihfFYS8Dq9WtsfdL6Cx2YPGNB",
    //       name: "video", buy_now_price: 100, artist_name: "Pips",
    //       aspect_ratio: 1, animation_url: "https://arweave.net/YoRtjMdbBmo0E-aKMWP51kve1xcUGyAYwI2jlGwR1lY?ext=mp4"
    //     }
    //   ],
    //   is_published: true,
    //   draft_content: content,
    //   published_content: content,
    //   curator: {
    //     username: "EV3",
    //     profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
    //     public_keys: ["EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"]
    //   },
    // }

    const name = context.params.curation_name;
    const curation = await getCurationByName(name)

    if (curation) {
      return { props: { curation } };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default CurationPage;