import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import CloudinaryImage from "../components/CloudinaryImage";
import MainNavigation from "../components/navigation/MainNavigation";
import UserContext from "../contexts/user";
import EditWrapper from "../components/curatorProfile/editWrapper";
import EditImageModal from "../components/curatorProfile/editImageModal";
import EditBioModal from "../components/curatorProfile/editBioModal";
import CurationHighlight from "../components/curatorProfile/curationHighlight";
import SocialLink from "../components/SocialLink";
import EditSocialsModal from "../components/curatorProfile/editSocialsModal";
import CurationList from "../components/curatorProfile/curationList";
import { useRouter } from "next/router";
import { updateBannerImage, updateBio, updateDisplayName, updateProfileImage, updateSocials } from "../data/user/updateProfile";
import { success, error } from "/utils/toastMessages";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import MainButton from "../components/MainButton";
import CreateCurationModal, { CollectorIcon } from "../components/curatorProfile/createCurationModal";
import getCuratorFromUsername from "../data/user/getCuratorByUsername";
import { getTokenCldImageId, isCustomId, parseCloudImageId } from "../utils/cloudinary/idParsing";
import { displayName as getDisplayName } from "../utils/displayName";
import SortableCurationPreviewWrapper from "../components/curations/sortableCurationPreviewWrapper";
import SortableCurationPreview from "../components/curations/sortableCurationPreview";
import saveCurationsOrder from "../data/user/saveCurationsOrder";
import * as Icon from 'react-feather'

import dynamic from 'next/dynamic';
import EditDisplayNameModal from "../components/curatorProfile/editDisplayNameModal";
import Tippy from "@tippyjs/react";
import { defaultCollectorImageId } from "../config/settings";
import useSWR from "swr";

const QuillContent = dynamic(() => import('../components/Quill').then(mod => mod.QuillContent), { ssr: false })


const bioPlaceholder = "Tell us about yourself!";

const getBioDelta = (curator, isOwner) => {
  if (curator?.bio_delta) return curator.bio_delta
  else if (isOwner) return JSON.stringify({
    ops: [
      {
        attributes: { size: '16px' },
        insert: curator?.bio || bioPlaceholder
      },
      {
        attributes: { align: 'center' },
        insert: "\n"
      },
    ]
  })
  else return JSON.stringify({ ops: [{ insert: "" }] })
}

function ProfilePage(
  { curator }
) {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);

  //TODO change to only get curations after load , with base curator info being available on load
  // const { data: curator } = useSWR(router.query.username, getCuratorFromUsername)

  const isOwner = Boolean(user && user.api_key && user.public_keys.some(key => curator?.public_keys.includes(key)));
  
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editDisplayNameOpen, setEditDisplayNameOpen] = useState(false);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);
  const [createCurationOpen, setCreateCurationOpen] = useState(false);

  const [banner, setBanner] = useState(curator?.banner_image);
  const [pfp, setPfp] = useState(curator?.profile_image);
  const [bio, setBio] = useState(getBioDelta(curator, isOwner));
  const [socials, setSocials] = useState(curator?.socials || []);
  const [displayName, setDisplayName] = useState(getDisplayName(curator));

  const [pfpLoaded, setPfpLoaded] = useState(true);
  const [useOwnerView, setUseOwnerView] = useState(false)
  const [bannerLoaded, setBannerLoaded] = useState(true);
  const [bannerImgId, setBannerImgId] = useState();

  const usingDefaultBanner = bannerImgId === defaultCollectorImageId

  const [curations, setCurations] = useState([]);
  const workingCurationsRef = useRef([])

  const pfpImgId = parseCloudImageId(pfp)

  
  const getCurationsInit = useCallback((baseCurations, curationOrder, useOwnerView) => {
    const curations = useOwnerView
      ? baseCurations
      : baseCurations.filter(curation => curation.is_published)

    if (curationOrder?.length) {
      const curationIds = curationOrder
      const ordered = curationIds.map(id => curations?.find(curation => curation.id === id))
        .filter(curation => curation)

      const remaining = curations?.filter(curation => !curationIds.includes(curation.id))
      return [...ordered, ...remaining]
    } else {
      return curations?.sort(curation => curation.is_published ? -1 : 1)
    }
  }, [])
 

  useEffect(() => {
    let timer

    if (!banner) {
      timer = setTimeout(() => {
        setBannerImgId(defaultCollectorImageId)
      }, 500)
    } else {
      const userBannerImgId = parseCloudImageId(banner)
      setBannerImgId(userBannerImgId || defaultCollectorImageId)
    }

    return () => clearTimeout(timer)
  }, [banner])
  
  useEffect(() => {
    //set up the initial state
    setUseOwnerView(isOwner)
    if (curator?.curations) setCurations(getCurationsInit(curator.curations, curator.curations_order, isOwner))
    //don't change when curator changes, this is just for on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner])

  useEffect(() => {
    //update the state when the curator changes
    if (curator) {
      setBanner(curator.banner_image);
      setPfp(curator.profile_image);
      setBio(getBioDelta(curator, isOwner));
      setSocials(curator.socials || []);
      setDisplayName(getDisplayName(curator));
    }
  }, [curator, isOwner])
 
  useEffect(() => {
    //set loaded to false when the banner changes
    if (banner !== curator?.banner_image) setBannerLoaded(false);
  }, [banner, curator?.banner_image])
  
  useEffect(() => {
    //set loaded to false when the pfp changes
    if (pfp !== curator?.profile_image) setPfpLoaded(false);
  }, [pfp, curator?.profile_image])

  const handleBannerError = () => {
    if (useOwnerView) {
      error("Failed to load banner image")
    }
    setBannerImgId(defaultCollectorImageId)
  }

  const handleSaveCurationOrder = async (curationIds) => {
    if (!isOwner || !curationIds) return

    const res = await saveCurationsOrder(user.api_key, curationIds) 

    if (res?.status !== "success") error("Failed to save curation order")
  }

  const handleCurationOrderChange = (setCurationsCB) => {
    if (!isOwner) return;
    setCurations(prev => {
      const newCurations = typeof setCurationsCB === "function"
        ? setCurationsCB(prev)
        : setCurationsCB;
      
      const order = newCurations.map(curation => curation.id)
      handleSaveCurationOrder(order)

      return newCurations
    })
  }

  const handleEditBanner = async (selectedToken) => {
    if (!isOwner) return;
    const cldId = isCustomId(selectedToken) ? selectedToken : getTokenCldImageId(selectedToken)
    setBanner(cldId);
    const res = await updateBannerImage(user.api_key, cldId)
    if (res.status === "success") success("Banner Updated")
    else error("Banner update failed")
  }

  const handleEditPfp = async (selectedToken) => { 
    if (!isOwner) return;
    const cldId = isCustomId(selectedToken) ? selectedToken : getTokenCldImageId(selectedToken)
    setPfp(cldId);
    const res = await updateProfileImage(user.api_key, cldId)
    if (res.status === "success") success("Profile Image Updated!")
    else error("Profile image update failed")
  }

  const handleEditBio = async (newBio) => {
    if (!isOwner) return;
    setBio(newBio);
    const res = await updateBio(user.api_key, newBio)
    if (res.status === "success") success("Bio Updated!")
    else error("Bio update failed")
  }

  const handleEditSocials = async (newSocials) => { 
    if(!isOwner) return;
    setSocials(newSocials);
    const res = await updateSocials(user.api_key, newSocials)
    if (res.status === "success") success("Socials Updated!")
    else error("Socials update failed")
  }

  const handleEditDisplayName = async (newDisplayName) => { 
    if (!isOwner) return;
    const res = await updateDisplayName(user.api_key, newDisplayName)
    if (res.status === "success") {
      success("Display Name Updated!")
      setDisplayName(newDisplayName);
      setUser(prev => ({ ...prev, name: newDisplayName }))
    }
    else error("Display name update failed")
  }

  const handleGoToSettings = () => { 
    router.push('/settings')
  }

  const toggleOwnerView = () => { 
    setUseOwnerView(prev => {
      const newUseView = !prev;

      if (newUseView && workingCurationsRef.current.length) {
        setCurations(workingCurationsRef.current)
      } else if (!newUseView) {
        //take the current curations and filter out the unpublished ones
  
        setCurations((prev) => {
          workingCurationsRef.current = prev;
          return prev.filter(curation => curation.is_published)
        })
      }

      return newUseView;
    })
 
  }
  if (!curator) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <p className="dark:text-neutral-100 pt-20 text-center">Sorry, we could not find a Curator with that name</p>
      </div>
    </>
  )
  return (
    <>
      <Toaster />
      <MainNavigation />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
        <EditWrapper
          isOwner={banner && useOwnerView}
          onEdit={() => setEditBannerOpen(true)}
          // placement="bottom-4 right-9 lg:right-[76px] 2xl:bottom-6 2xl:right-[44px]"

          placement="bottom-4 right-[16px] md:right-[32px] lg:right-[80px] 2xl:bottom-6 2xl:right-[48px]"
          groupHoverClass="group-hover/banner:opacity-100 group-hover/banner:bg-neutral-200 dark:group-hover/banner:bg-neutral-800 group-hover/banner:border-neutral-700 dark:group-hover/banner:border-neutral-300"
          text="Edit Banner"
          icon={<Icon.Image size={23} strokeWidth={2.5} />}
        >
          <div className="w-full pb-[33%] relative 2xl:rounded-b-2xl shadow-md overflow-hidden">
     
            <CloudinaryImage
              className={clsx(
                "absolute inset-0 w-full h-full object-cover",
                !bannerLoaded && "animate-pulse",
                usingDefaultBanner && "dark:invert"
              )}
              id={bannerImgId}
              noLazyLoad
              onLoad={() => setBannerLoaded(true)}
              width={2000}
              onError={handleBannerError}
            />
            
            {(usingDefaultBanner && useOwnerView) ? (
              <div className={clsx(
                "absolute inset-0 w-full h-full flex justify-center items-center",
                "bg-neutral-500/50 backdrop-blur-sm",
              )}>
                <MainButton
                  size="xl"
                  onClick={() => setEditBannerOpen(true)}
                  className={clsx("flex items-center gap-2", !useOwnerView && "hidden")}
                >
                  Add Banner
                  <Icon.Plus strokeWidth={2.5} />
                </MainButton>
              </div>
            ) : null}
          </div>
        </EditWrapper>
        <div
          className="absolute -bottom-12 left-6 lg:left-16 group/pfp rounded-full"
        >
          <EditWrapper
            isOwner={useOwnerView}
            onEdit={() => setEditPfpOpen(true)}
            groupHoverClass="group-hover/pfp:opacity-100 group-hover/pfp:bg-neutral-200 dark:group-hover/pfp:bg-neutral-800 group-hover/pfp:border-neutral-700 dark:group-hover/pfp:border-neutral-300"
            buttonClassName="rounded-full p-1.5"
            noButtonPadding
            text={true}
            icon={<Icon.Image size={24} strokeWidth={2.5} />}
            placement="top-0 right-0"
          >
            {pfp ? (
              <CloudinaryImage
                className={clsx(
                  "w-20 h-20 md:w-32 md:h-32 object-cover rounded-full overflow-hidden palette3 borderPalette0 border-4 ",
                  !pfpLoaded && "animate-pulse"
                )}
                id={pfpImgId}
                noLazyLoad
                onLoad={() => setPfpLoaded(true)}
                width={500}
              />
            ) : (
                <div className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-full palette3 borderPalette0 border-4 relative">
                  {/* {useOwnerView ? (
                    <MainButton
                      onClick={() => setEditPfpOpen(true)}
                      className={clsx("flex items-center justify-center gap-2 absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-max")}
                    >
                      Add Pfp
                      <Icon.Plus strokeWidth={2.5} />
                    </MainButton>
                  ) : ( */}
                      <p className="collector text-5xl md:text-7xl font-bold absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[60%]">c</p> 
                  {/* )} */}
              </div>
            )}
          </EditWrapper>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-16 w-full">
        <div className="px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
            <div className="flex flex-wrap items-center gap-6 group/settings w-full">

              <EditWrapper
                className="max-w-fit"
                isOwner={useOwnerView}
                onEdit={() => setEditDisplayNameOpen(true)}
                placement="-top-3 -right-3"
                groupHoverClass="group-hover/settings:opacity-100 group-hover/settings:bg-neutral-200 dark:group-hover/settings:bg-neutral-800 group-hover/settings:border-neutral-700 dark:group-hover/settings:border-neutral-300"
                buttonClassName="rounded-full p-1.5"
                noButtonPadding
                text={true}
                icon={<Icon.Edit size={20} strokeWidth={2.5} />}
              >
                <h1 className="font-bold mr-2 text-4xl md:text-5xl overflow-y-hidden overflow-x-auto w-full pb-1.5">{displayName}</h1>
              </EditWrapper>

              <EditWrapper
                className="max-w-fit"
                isOwner={useOwnerView}
                onEdit={() => setEditSocialsOpen(true)}
                placement="left-0 -top-[115%]  md:left-auto  md:top-1/2 md:-right-2 md:-translate-y-1/2 md:translate-x-full "
                groupHoverClass="group-hover/settings:opacity-100"
                text="Edit Socials"
                buttonClassName="w-max"
                icon=" "
                buttonSize="md"
              >
                <div className="flex items-center gap-0">
                  {socials.length
                    ? socials.map((social, index) => (
                      <SocialLink
                        key={social.type + index}
                        link={social.link} type={social.type}
                      />
                      
                    ))
                    : null
                  }
                </div>
              </EditWrapper>
            </div>
          </div>
          <div className={clsx(
            "group/bio w-full mx-auto rounded-md border-4 min-h-10 left",
            useOwnerView
              ? "duration-300 border-dashed border-neutral-300/60 dark:border-neutral-700/60 hover:border-neutral-300 hover:dark:border-neutral-700 cursor-pointer"
              : "border-transparent",
          )}
            onClick={() => useOwnerView && setEditBioOpen(true)}
          >
            <EditWrapper
              isOwner={useOwnerView}
              onEdit={() => setEditBioOpen(true)}
              placement="tr"
              groupHoverClass="group-hover/bio:opacity-100 group-hover/bio:scale-105"
              // text="Edit Bio"
              icon={<Icon.Edit size={24} strokeWidth={2.5} />}
            >
              <QuillContent textDelta={bio}/>
            </EditWrapper>
          </div>
        </div>

        <hr className="mt-12 mb-6 borderPalette1" />

        <div className="py-4 md:p-4">
          {useOwnerView
            ? (
              <SortableCurationPreviewWrapper
                curations={curations}
                setCurations={handleCurationOrderChange}
              >
                {curations?.length
                  ? (
                    <>
                      <SortableCurationPreview id={curations[0].id}>
                        <CurationHighlight curation={curations[0]} isOwner={isOwner} setCurations={setCurations} />
                      </SortableCurationPreview>

                      <div className="h-6"/>
              
                      <CurationList asSortable curations={curations.slice(1)} isOwner={isOwner} setCurations={setCurations} />
                    </>
                  )
                  : null
                }
              </SortableCurationPreviewWrapper>

            )
            : curations?.length
              ? (
                <>
                  <div className="border-4 border-transparent">
                    <CurationHighlight curation={curations[0]} isOwner={false} />
                  </div>
                  <div className="h-6" />
                  <CurationList curations={curations.slice(1)} isOwner={false} />
                </>
              )
              : null
          }
        </div>
        
        {useOwnerView
          ? (
            <MainButton
              size={"xl"}
              className="m-auto flex items-center justify-center gap-4 mt-8"
              onClick={() => setCreateCurationOpen(true)}
            >
              Create new curation 
              {/* <Icon.Plus  strokeWidth={2.5} /> */}
              <CollectorIcon />
            </MainButton>
          )
          : null
        }
      </div>
      {useOwnerView
        ? (
          <>
            <EditImageModal
              title="Editing Banner"
              isOpen={editBannerOpen}
              onClose={() => setEditBannerOpen(false)}
              onSave={handleEditBanner}
              type="banner"
            />
            <EditImageModal
              title="Editing Profile Image"
              isOpen={editPfpOpen}
              onClose={() => setEditPfpOpen(false)}
              onSave={handleEditPfp}
              type="pfp"
            />
            <EditBioModal
              isOpen={editBioOpen}
              onClose={() => setEditBioOpen(false)}
              onSave={handleEditBio}
              bio={bio}
            />
            <EditSocialsModal
              isOpen={editSocialsOpen}
              onClose={() => setEditSocialsOpen(false)}
              onSave={handleEditSocials}
              socials={socials}
            />
            <CreateCurationModal
              isOpen={createCurationOpen}
              onClose={() => setCreateCurationOpen(false)}
            />
            <EditDisplayNameModal
              name={displayName}
              isOpen={editDisplayNameOpen}
              onClose={() => setEditDisplayNameOpen(false)}
              onSave={handleEditDisplayName}
            />
          </>
        )
        : null
      }

      <Tippy
        content={useOwnerView ? "Switch to public view" : "Switch to edit view"}
      >
        <div
          className={clsx('z-10 fixed bottom-0 left-0 rotate-45 h-10 w-10', !isOwner && "hidden")}
        >
          <button
            onClick={toggleOwnerView}
            className='hoverPalette2 borderPalette2 border-2 palette2 absolute right-1/2 translate-x-[50%] top-0 h-[150%] w-[300%] flex justify-center items-start pt-1'>
            {useOwnerView
              ? <Icon.Eye className="-rotate-45"/>
              : <Icon.Edit className="-rotate-45" />
            }
          </button>
        </div>
      </Tippy>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const username = context.params.username;
    const curator = await getCuratorFromUsername(username)

    if (curator) {
      return { props: { curator } };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default ProfilePage;