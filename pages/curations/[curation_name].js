import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
import getCurationByName, { useCurationDetails } from "../../data/curation/getCurationByName";
import getPrivateContent, { getViewerPrivateContent } from "../../data/curation/getPrivateContent";
import publishContent, { unpublishContent } from "../../data/curation/publishContent";
import { success, error } from "../../utils/toast";
import updateApprovedArtists, { addSelfApprovedArtists } from "../../data/curation/updateApprovedArtists";
import updateCurationName from "../../data/curation/updateCurationName";
import useActionCable from "../../hooks/useWebsocket";
import saveDraftContent from "../../data/curation/saveDraftContent";
import { useRouter } from "next/router";
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse";
import withdrawFromTreasury from "../../data/curation/withdrawFromTreasury";
import { roundToPrecision } from "../../utils/maths";


import Head from "next/head";
import { metaPreviewImage } from "../../config/settings";
import { baseCloudImageUrl } from "../../utils/cloudinary/baseCldUrl";
import { getTokenCldImageId, isCustomId, parseCloudImageId } from "../../utils/cloudinary/idParsing";
import AuthorizedViewerBar from "../../components/curations/authorizedViewerBar";
import { deleteMultipleSubmissions } from "../../data/curationListings/deleteSubmission";

import dynamic from 'next/dynamic';
import { deltaToPlainText } from "../../utils/Quill";
const QuillContent = dynamic(() => import('../../components/Quill').then(mod => mod.QuillContent), { ssr: false })

const descriptionPlaceholder = "Tell us about this curation."

function CurationPage({curation}) {
  const [user] = useContext(UserContext);
  const router = useRouter();
  const curationDetails = useCurationDetails(router.query?.curation_name)

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
  const [owners, setOwners] = useState([]);

  const [name, setName] = useState(curation?.name);
  const [publishedContent, setPublishedContent] = useState(curation?.published_content);
  const [draftContent, setDraftContent] = useState(null);
  const [privateKeyHash, setPrivateKeyHash] = useState(null);
  const [viewerPasscode, setViewerPasscode] = useState(null);

  const viewerPasscodeQuery = router.query?.passcode;

  const isOwner = Boolean(user && user.api_key && user.public_keys.includes(curation?.curator.public_keys[0]));
  const isAuthorizedViewer = Boolean(!isOwner && user && viewerPasscodeQuery && draftContent)
 
  const useDraftContent = isEditingDraft && (isOwner || isAuthorizedViewer);
  const banner = useDraftContent ? draftContent?.banner_image : publishedContent?.banner_image;

  const draftDescriptionDelta = draftContent?.description_delta || JSON.stringify({
    ops: [
      {
        attributes: { size: 'large' },
        insert: draftContent?.description || descriptionPlaceholder,
      },
      {
        attributes: { align: 'center' },
        insert: "\n"
      },
    ]
  })
  const publishedDescriptionDelta = publishedContent?.description_delta || JSON.stringify({
    ops: [
      {
        attributes: { size: 'large' },
        insert: publishedContent?.description || ""
      },
      {
        attributes: { align: 'center' },
        insert: "\n"
      },
    ]
  })
  const description = useDraftContent ? draftDescriptionDelta : publishedDescriptionDelta;
  
  const modules = useDraftContent ? draftContent?.modules : publishedContent?.modules;

  const displayPublishedEdit = globalEditOpen && isOwner;
  const displayDraftEdit = globalEditOpen && useDraftContent && isOwner;
  const displayCuration = Boolean(curation?.is_published || isOwner || isAuthorizedViewer);

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
          return token.mint === data?.mint
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
    if (!curationDetails) return
    setSubmittedTokens(curationDetails?.submitted_token_listings || [])
    setApprovedArtists(curationDetails?.approved_artists || [])
    setOwners(curationDetails?.owners || [])
  }, [curationDetails])

  useEffect(() => {
    if ((isOwner || viewerPasscodeQuery && user?.api_key) && curation?.name) {
      (async () => {
        if (isOwner) {
          const { draft_content, private_key_hash, viewer_passcode } = await getPrivateContent({
            name: curation.name,
            apiKey: user.api_key,
          })
          setDraftContent(draft_content)
          setPrivateKeyHash(private_key_hash)
          setViewerPasscode(viewer_passcode)
        } else {
          //is authorized viewer
          const res = await getViewerPrivateContent({
            name: curation.name,
            apiKey: user.api_key,
            viewerPasscode: viewerPasscodeQuery
          })
          if (res?.draft_content) setDraftContent(res.draft_content)
        }
        setGlobalEditOpen(true)
      })();
    }
  }, [isOwner, curation?.name, user?.api_key, viewerPasscodeQuery])

  useEffect(() => {
    if (!useDraftContent || !publishContent.banner_image) return;
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

      // delete any submissions no longer being used
      if (curation.curation_type !== "curator") {//"artist" || "collector" 
        const unusedTokenMints = [];
        //"modules" will be draft modules
        //if token doesn't exist there it can be removed for the submission list
        const filteredSubmissions = submittedTokens.filter((token) => {
          const existsInModules = modules.some((module) => module.type === "art" && module.tokens.includes(token.mint))
          if (!existsInModules) unusedTokenMints.push(token.mint)
          return existsInModules
        })
        setSubmittedTokens(filteredSubmissions)
        
        //No need to handle errors here, failing to delete unused submissions wont have any impact on publishing
        await deleteMultipleSubmissions({
          curationId: curation.id,
          tokenMints: unusedTokenMints,
          apiKey: user.api_key,
        })
      }


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
    const res = await updateApprovedArtists({
      artistIds: newArtists.map((artist) => artist.id),
      apiKey: user.api_key,
      name: curation.name
    })

    if (res?.status !== "success") error("Artist invitation failed");
    else setApprovedArtists(newArtists)
  }

  const handleInviteSelf = async () => { 
    const res = await addSelfApprovedArtists({
      apiKey: user.api_key,
      viewerPasscode: viewerPasscodeQuery
    })

    if (res?.status !== "success") error("Artist invitation failed")
    else setApprovedArtists(prev => [...prev, user])
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
      success(`Successfully withdrew ${ roundToPrecision(collectedFees.curatorBalance, 3) } SOL!`)
      setCollectedFees({
        curatorBalance: 0,
        platformBalance: 0
      })
    } else {
      error(`Withdrawal failed`)
    }
  }

  const curatorText = useMemo(() => {
    switch (curation?.curation_type) {
      case "artist": return "Art by"
      case "collector": return "Collected by"
      case "curator": return "Curated by"
    }
  }, [curation?.curation_type])


  if (isOwner && !draftContent && !publishedContent) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <h1 className="animate-pulse font-bold text-4xl text-center mt-[25%]">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
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
       
        <div className="group/name w-fit mb-3 mx-auto max-w-full">
          <EditWrapper
            isOwner={displayPublishedEdit}
            onEdit={() => setEditNameOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/name:opacity-100"
          // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <h1 className="font-bold text-5xl text-center w-full break-words">{name.replaceAll("_", " ")}</h1>
          </EditWrapper>
        </div>
        <Link href={`/gallery/${ curation.curator.username }`} >
          <a className="flex gap-2 items-center justify-center mb-8 hover:scale-105 duration-300 w-fit mx-auto ">
            <p className="text-lg">{curatorText} {curation.curator.username}</p>
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

        {curationDetails ? (
          <DisplayModules
            modules={modules}
            isOwner={displayDraftEdit}
            setModules={handleEditModules}
            submittedTokens={submittedTokens}
            approvedArtists={approvedArtists}
            handleCollect={handleCollect}
            curationType={curation.curation_type}
            curationId={curation.id}
            setSubmittedTokens={setSubmittedTokens}
            owners={owners}
          />

        )
          : <h1 className="animate-pulse font-bold text-4xl text-center mt-10">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
        }

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
              curation={curation}
              submittedTokens={submittedTokens}
            />
          )
          : null
        }
        {isAuthorizedViewer
          ? (
            <AuthorizedViewerBar
              isOpen={globalEditOpen}
              setOpen={setGlobalEditOpen}
            
              handleInviteSelf={handleInviteSelf}
              isEditingDraft={isEditingDraft}
              setIsEditingDraft={setIsEditingDraft}
              isPublished={isPublished}
              isApproved={approvedArtists.some(a => a.id === user.id)}
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
              viewerPasscode={viewerPasscode}
              name={curation.name}
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
    console.log("🚀 ~ file: [curation_name].js:575 ~ getServerSideProps ~ curation:", curation)

    if (curation) {
      // //TODO remove this placeholder
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