import { useContext, useEffect, useState } from "react";
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
import { QuillContent } from "../../components/Quill";
import { getTokenCldImageId, isCustomId, parseCloudImageId } from "../../utils/cloudinary/idParsing";

const bioPlaceholder = "Tell us about yourself!";

function ProfilePage({ curator }) {
  const [user] = useContext(UserContext);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);
  const [createCurationOpen, setCreateCurationOpen] = useState(false);

  const [banner, setBanner] = useState(curator?.banner_image);
  const [pfp, setPfp] = useState(curator?.profile_image);
  const bioDelta = curator?.bio_delta || JSON.stringify({ops:[{insert: curator?.bio || bioPlaceholder}]})

  const [bio, setBio] = useState(bioDelta);
  const [socials, setSocials] = useState(curator?.socials || []);

  const [bannerLoaded, setBannerLoaded] = useState(true);
  const [pfpLoaded, setPfpLoaded] = useState(true);
  
  const isOwner = Boolean(user && user.public_keys.includes(curator?.public_keys?.[0]) && user.api_key);
  const curations = isOwner
    ? curator?.curations.sort(curation => curation.is_published ? -1 : 1)
    : curator?.curations.filter(curation => curation.is_published);
  
  const bannerImgId = parseCloudImageId(banner)
  const pfpImgId = parseCloudImageId(pfp)

  useEffect(() => {
    //set loaded to false when the banner changes
    if (banner !== curator?.banner_image) setBannerLoaded(false);
  }, [banner, curator?.banner_image])
  
  useEffect(() => {
    //set loaded to false when the pfp changes
    if (pfp !== curator?.profile_image) setPfpLoaded(false);
  }, [pfp, curator?.profile_image])

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
          isOwner={isOwner}
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
                width={2000}
              />
            ) : (
                <div className="absolute inset-0 w-full h-full object-cover 2xl:rounded-b-2xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25 flex justify-center items-center">
                  <p className="font-xl font-bold">Click the edit button in the top right to add a banner</p>
                </div>
            )}
          </div>
        </EditWrapper>
        <div className="w-32 h-32 lg:w-40 lg:h-40 absolute -bottom-12 ml-6 lg:ml-12 2xl:ml-6 group/pfp">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditPfpOpen(true)}
            placement="tr"
            groupHoverClass="group-hover/pfp:opacity-100"
            // icon={<PhotographIcon className="w-6 h-6" />}
          >
            {pfp ? (
              <CloudinaryImage
                className={clsx(
                  "w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-8 border-white dark:border-black",
                  !pfpLoaded && "animate-pulse"
                )}
                id={pfpImgId}
                noLazyLoad
                onLoad={() => setPfpLoaded(true)}
                width={500}
              />
            ) : (
              <div className="flex justify-center items-center w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800 border-8 border-white dark:border-black">
                <p className="collector text-8xl font-bold mb-5">c</p>
              </div>
            )}
          </EditWrapper>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-16">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <h1 className="font-bold text-5xl mr-3">{curator.username}</h1>
          <EditWrapper
            className="max-w-fit"
            isOwner={isOwner}
            onEdit={() => setEditSocialsOpen(true)}
            placement="outside-tr"
            // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <div className="flex items-center gap-2">
              {socials.length
                ? socials.map((social, index) => (
                  <SocialLink
                    key={social.type + index}
                    link={social.link} type={social.type}
                  />
                  
                ))
                : <p>Link your socials</p>
              }
            </div>
          </EditWrapper>
        </div>
        <div className="group/bio w-full">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditBioOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/bio:opacity-100"
            // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <QuillContent textDelta={bio}/>
          </EditWrapper>
        </div>

        <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
        
        {curations?.length
          ? (
            <>
              <CurationHighlight curation={curations[0]} isOwner={isOwner} />
      
              <hr className="my-12 border-neutral-200 dark:border-neutral-800" />  
              
              <CurationList curations={curations.slice(1)} isOwner={isOwner}/>
            </>
          )
          : null
        }

        {isOwner
          ? (
            <MainButton
              className="mx-auto flex items-center"
              onClick={() => setCreateCurationOpen(true)}
            >
              Create New Curation <PlusIcon className="w-6 h-6 ml-2" />
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