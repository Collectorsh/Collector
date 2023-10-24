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
import { QuillContent, deltaToPlainText } from "../../components/Quill";
import Head from "next/head";
import { metaPreviewImage } from "../../config/settings";
import { baseCloudImageUrl } from "../../utils/cloudinary/baseCldUrl";
import { getTokenCldImageId, isCustomId, parseCloudImageId } from "../../utils/cloudinary/idParsing";


const descriptionPlaceholder = "Tell us about this curation."

function CurationPage({ curation }) {
  const [user] = useContext(UserContext);
  const router = useRouter();
  const { handleCollect, collectedFees, setCollectedFees } = useCurationAuctionHouse(curation)

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

  const isOwner = true//Boolean(user && user.api_key && user.public_keys.includes(curation?.curator.public_keys[0]));
 
  const useDraftContent = isEditingDraft && isOwner;
  const banner = useDraftContent ? draftContent?.banner_image : publishedContent?.banner_image;

  const draftDescriptionDelta = draftContent?.description_delta || JSON.stringify({ ops: [{ insert: draftContent?.description || descriptionPlaceholder }] })
  const publishedDescriptionDelta = publishedContent?.description_delta || JSON.stringify({ ops: [{ insert: publishedContent?.description || "" }] })
  const description = useDraftContent ? draftDescriptionDelta : publishedDescriptionDelta;
  
  const modules = useDraftContent ? draftContent?.modules : publishedContent?.modules;

  const displayPublishedEdit = globalEditOpen && isOwner;
  const displayDraftEdit = globalEditOpen && useDraftContent;
  const displayCuration = Boolean(curation?.is_published || isOwner);

  const hasChanges = JSON.stringify(draftContent) !== JSON.stringify(publishedContent);

  //currently we are allowing curations to be published without content
  const hasNoContent = false//{modules.length === 0 || !banner} 

  const bannerImgId = parseCloudImageId(banner)
  const pfpImgId = parseCloudImageId(curation?.curator?.profile_image)

  const metaImage = curation?.published_content?.banner_image
    ? baseCloudImageUrl(parseCloudImageId(curation.published_content.banner_image))
    : metaPreviewImage

  const handleWebsocketMessages = useCallback(({ message, data }) => {
    switch (message) {
      case "Listing Update": {
        setSubmittedTokens((prev) => prev.map((token) => { 
          return token?.mint === data?.mint
            ? { ...token, ...data }
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
          apiKey: "66a83ac053cdf623ce7e620ad02b4aa0"//user.api_key
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
        description: deltaToPlainText(JSON.parse(newDescription)),
        description_delta: newDescription
      }
      handleSaveDraftContent(newContent)
      return newContent
    });
  }

  const handleEditBanner = (newToken) => { 
    if (!isOwner) return;
    const cldId = isCustomId(newToken) ? newToken : getTokenCldImageId(newToken)
    setDraftContent(prev => {
      const newContent = {
        ...prev,
        banner_image: cldId
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
      setCollectedFees({
        curatorBalance: 0,
        platformBalance: 0
      })
      success(`Successfully withdrew ${ roundToPrecision(collectedFees.curatorBalance, 3) } SOL!`)
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

  const curationMetaDescription = `${ curation.name.replaceAll("_", " ") } by ${ curation.curator.username }`

  return (
    <>
      <Head>
        <meta key="description" name="description" content={curationMetaDescription} />
        <meta key="og-description" property="og:description" content={curationMetaDescription} />
        <meta key="og-url" property="og:url" content={`https://collector.sh/curations/${ curation.name }`} />
        <meta key="og-image" property="og:image" content={metaImage} />

        <meta key="twitter-description" name="twitter:description" content={curationMetaDescription} />
        <meta key="twitter-image" name="twitter:image" content={metaImage} />
      </Head>
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
                id={bannerImgId}
                noLazyLoad
                onLoad={() => setBannerLoaded(true)}
                width={3000}
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
        <Link href={`/gallery/${ curation.curator.username }`} >
          <a className="flex gap-2 items-center justify-center mb-8 hover:scale-105 duration-300 w-fit mx-auto ">
            <p className="text-lg">Curated by {curation.curator.username}</p>
            {curation.curator.profile_image
              ? (<div className="relative">
                  <CloudinaryImage
                    className={clsx(
                      "w-14 h-14 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800",
                    )}
                    id={pfpImgId}
                    noLazyLoad
                    width={500}
                  />
                </div>)
                : null
              }
          </a>
        </Link>
  
        <div className="group/description w-full mx-auto">
          <EditWrapper
            isOwner={displayDraftEdit}
            onEdit={() => setEditDescriptionOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/description:opacity-100"
          // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <QuillContent textDelta={description} />
          </EditWrapper>
        </div>

        <hr className="my-12 border-neutral-200 dark:border-neutral-800" />

        <DisplayModules
          modules={modules}
          isOwner={displayDraftEdit}
          setModules={handleEditModules}
          submittedTokens={submittedTokens}
          approvedArtists={approvedArtists}
          handleCollect={handleCollect}
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
              noContent={hasNoContent}
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
              curation={curation}
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