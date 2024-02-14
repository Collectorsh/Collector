import { useContext, useEffect, useMemo, useState } from "react";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation";
import UserContext from "../../contexts/user";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import { PencilAltIcon, PhotographIcon, PlusIcon } from "@heroicons/react/solid";
import EditImageModal from "../../components/curatorProfile/editImageModal";
import EditBioModal from "../../components/curatorProfile/editBioModal";
import CurationHighlight from "../../components/curatorProfile/curationHighlight";
import SocialLink from "../../components/SocialLink";
import EditSocialsModal from "../../components/curatorProfile/editSocialsModal";
import CurationList from "../../components/curatorProfile/curationList";
import { useRouter } from "next/router";
import { updateBannerImage, updateBio, updateProfileImage, updateSocials } from "../../data/user/updateProfile";
import { success, error } from "/utils/toastMessages";
import getUserFromUsername from "../../data/user/getUserFromUsername";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import MainButton from "../../components/MainButton";
import CreateCurationModal from "../../components/curatorProfile/createCurationModal";
import getCuratorFromUsername from "../../data/user/getCuratorByUsername";
import { getTokenCldImageId, isCustomId, parseCloudImageId } from "../../utils/cloudinary/idParsing";

import SortableCurationPreviewWrapper from "../../components/curations/sortableCurationPreviewWrapper";
import SortableCurationPreview from "../../components/curations/sortableCurationPreview";
import saveCurationsOrder from "../../data/user/saveCurationsOrder";
import * as Icon from 'react-feather'

import dynamic from 'next/dynamic';
const QuillContent = dynamic(() => import('../../components/Quill').then(mod => mod.QuillContent), { ssr: false })


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

function ProfilePage({ curator }) {
  const router = useRouter();
  const [user] = useContext(UserContext);
  const isOwner = Boolean(user && user.public_keys.includes(curator?.public_keys?.[0]) && user.api_key);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);
  const [createCurationOpen, setCreateCurationOpen] = useState(false);

  const [banner, setBanner] = useState(curator?.banner_image);
  const [pfp, setPfp] = useState(curator?.profile_image);
  const [bio, setBio] = useState(getBioDelta(curator, isOwner));
  const [socials, setSocials] = useState(curator?.socials || []);

  const [bannerLoaded, setBannerLoaded] = useState(true);
  const [pfpLoaded, setPfpLoaded] = useState(true);
  

  const curationsInit = useMemo(() => {
    const curations = isOwner
      ? curator?.curations
      : curator?.curations.filter(curation => curation.is_published)
    
    if (curator.curations_order?.length) { 
      const curationIds = curator.curations_order
      const ordered = curationIds.map(id => curations?.find(curation => curation.id === id))
        .filter(curation => curation)
      
      const remaining = curations?.filter(curation => !curationIds.includes(curation.id))
      return [...ordered, ...remaining]
    } else {
      return curations?.sort(curation => curation.is_published ? -1 : 1)
    }
  }, [curator, isOwner])
 
  const [curations, setCurations] = useState(curationsInit);

  const bannerImgId = parseCloudImageId(banner)
  const pfpImgId = parseCloudImageId(pfp)

  useEffect(() => {
    //update the state when the curator changes
    if (curator) {
      setBanner(curator.banner_image);
      setPfp(curator.profile_image);
      setBio(getBioDelta(curator, isOwner));
      setSocials(curator.socials || []);
      setCurations(curationsInit);
    }
  },[curator, isOwner, curationsInit])

  useEffect(() => {
    //set loaded to false when the banner changes
    if (banner !== curator?.banner_image) setBannerLoaded(false);
  }, [banner, curator?.banner_image])
  
  useEffect(() => {
    //set loaded to false when the pfp changes
    if (pfp !== curator?.profile_image) setPfpLoaded(false);
  }, [pfp, curator?.profile_image])

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
      handleSaveCurationOrder(newCurations.map(curation => curation.id))
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

  const handleGoToSettings = () => { 
    router.push('/settings')
  }

  if (!curator) return (
    <>
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <p className="dark:text-gray-100 pt-20 text-center">Sorry, we could not find a Curator with that name</p>
      </div>
    </>
  )
  return (
    <>
      <Toaster />
      <MainNavigation />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
        <EditWrapper
          isOwner={banner && isOwner}
          onEdit={() => setEditBannerOpen(true)}
          placement="bottom-4 right-9 lg:right-[76px] 2xl:bottom-6 2xl:right-[44px]"
          groupHoverClass="group-hover/banner:opacity-100"
          text="Edit Banner"
          icon={<Icon.Image size={20} strokeWidth={2.5} />}
        >
          <div className="w-full pb-[50%] md:pb-[33%] relative 2xl:rounded-b-2xl shadow-md shadow-black/20 overflow-hidden">
            {banner ? (
              <CloudinaryImage
                className={clsx(
                  "absolute inset-0 w-full h-full object-cover",
                  !bannerLoaded && "animate-pulse"
                )}
                id={bannerImgId}
                noLazyLoad
                onLoad={() => setBannerLoaded(true)}
                width={2000}
              />
            ) : (
                <div className={clsx(
                  "absolute inset-0 w-full h-full flex justify-center items-center bg-zinc-200 dark:bg-zinc-800",
                )}>
                  <MainButton
                    size="xl"
                    onClick={() => setEditBannerOpen(true)}
                    className={clsx("flex items-center gap-2", !isOwner && "hidden")}
                  >
                    Add Banner
                    <Icon.Plus strokeWidth={2.5} />
                  </MainButton>
                </div>
            )}
          </div>
        </EditWrapper>
        <div
          className="absolute -bottom-12 left-6 lg:left-16 group/pfp rounded-full"
        >
          <EditWrapper
            isOwner={pfp && isOwner}
            onEdit={() => setEditPfpOpen(true)}
            placement="top-0 sm:-right-4 sm:translate-x-1/2 "
            groupHoverClass="group-hover/pfp:opacity-100"
            text="Edit Pfp"
            icon={<Icon.Image size={20} strokeWidth={2.5} />}
            buttonClassName="w-max"
          >
            {pfp ? (
              <CloudinaryImage
                className={clsx(
                  "w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full overflow-hidden palette3 borderPalette0 border-4 ",
                  !pfpLoaded && "animate-pulse"
                )}
                id={pfpImgId}
                noLazyLoad
                onLoad={() => setPfpLoaded(true)}
                width={500}
              />
            ) : (
                <div className="flex justify-center items-center w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full palette3 borderPalette0 border-4">
                  {isOwner ? (
                    <MainButton
                      onClick={() => setEditPfpOpen(true)}
                      className={clsx("flex items-center justify-center gap-2 absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-max")}
                    >
                      Add Pfp
                      <Icon.Plus strokeWidth={2.5} />
                    </MainButton>
                  ) : (
                    <p className="collector text-8xl font-bold mb-5">c</p> 
                  )}
              </div>
            )}
          </EditWrapper>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-16">
        <div className="px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
            <div className="flex flex-wrap items-center gap-6 group/settings">

              <EditWrapper
                className="max-w-fit"
                isOwner={isOwner}
                onEdit={handleGoToSettings}
                placement="tr"
                groupHoverClass="group-hover/settings:opacity-100"
                buttonClassName="palette3 hoverPalette3 p-1"
              >
                <h1 className="font-bold text-5xl mr-2">{curator.username}</h1>
              </EditWrapper>

              <EditWrapper
                className="max-w-fit"
                isOwner={isOwner}
                onEdit={() => setEditSocialsOpen(true)}
                placement="top-1/2 -right-2 -translate-y-1/2 translate-x-full"
                groupHoverClass="group-hover/settings:opacity-100"
                text="Edit Socials"
                buttonClassName="w-max"
                icon=" "
              >
                <div className="flex items-center gap-2">
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
            "group/bio w-full mx-auto rounded-md border-4 border-transparent",
            isOwner && "duration-300 border-dashed border-zinc-200/40 dark:border-zinc-700/40 hover:border-zinc-200 hover:dark:border-zinc-700",
          )}>
            <EditWrapper
              isOwner={isOwner}
              onEdit={() => setEditBioOpen(true)}
              placement="tr"
              groupHoverClass="group-hover/bio:opacity-100"
              text="Edit Bio"
              icon={<Icon.Edit size={20} strokeWidth={2.5} />}
            >
              <QuillContent textDelta={bio}/>
            </EditWrapper>
          </div>
        </div>

        <hr className="mt-12 borderPalette1" />

        <div className="p-4">
          {isOwner
            ? (
              <SortableCurationPreviewWrapper
                curations={curations}
                setCurations={handleCurationOrderChange}
              >
                {curations?.length
                  ? (
                    <>
                      <SortableCurationPreview id={curations[0].id}>
                        <CurationHighlight curation={curations[0]} isOwner={isOwner} />
                      </SortableCurationPreview>
              
                      <CurationList asSortable curations={curations.slice(1)} isOwner={isOwner}/>
                    </>
                  )
                  : null
                }
              </SortableCurationPreviewWrapper>

            )
            : curations?.length
              ? (
                <>
                  <CurationHighlight curation={curations[0]} isOwner={isOwner} />
                  <CurationList curations={curations.slice(1)} isOwner={isOwner} />
                </>
              )
              : null
          }
        </div>
        
        {isOwner
          ? (
            <MainButton
              size={"xl"}
              className="m-auto flex items-center justify-center gap-2 mt-8"
              onClick={() => setCreateCurationOpen(true)}
            >
              Create new curation 
              <Icon.Plus  strokeWidth={2.5} />
            </MainButton>
          )
          : null
        }
      </div>
      {isOwner
        ? (
          <>
            <EditImageModal
              title="Edit Banner Image"
              isOpen={editBannerOpen}
              onClose={() => setEditBannerOpen(false)}
              onSave={handleEditBanner}
              type="banner"
            />
            <EditImageModal
              title="Edit Profile Image"
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
          </>
        )
        : null
      }
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