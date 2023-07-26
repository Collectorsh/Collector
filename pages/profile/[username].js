import { useContext, useEffect, useState } from "react";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation";
import UserContext from "../../contexts/user";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import { PencilAltIcon, PhotographIcon, PlusIcon } from "@heroicons/react/solid";
import EditImageModal from "../../components/curatorProfile/editImageModal";
import EditBioModal from "../../components/curatorProfile/editBioModal";
import GalleryHighlight from "../../components/curatorProfile/galleryHighlight";
import SocialLink from "../../components/SocialLink";
import EditSocialsModal from "../../components/curatorProfile/editSocialsModal";
import GalleryList from "../../components/curatorProfile/galleryList";
import { useRouter } from "next/router";
import { updateBannerImage, updateBio, updateProfileImage, updateSocials } from "../../data/user/updateProfile";
import { success, error } from "/utils/toastMessages";
import getUserFromUsername from "../../data/user/getUserFromUsername";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import MainButton from "../../components/MainButton";
import CreateGalleryModal from "../../components/curatorProfile/createGalleryModal";

const bioPlaceholder = "Tell us about yourself!";

function ProfilePage({ curator }) {
  const [user] = useContext(UserContext);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);
  const [createGalleryOpen, setCreateGalleryOpen] = useState(false);

  const [banner, setBanner] = useState(curator?.banner_image);
  const [pfp, setPfp] = useState(curator?.profile_image);
  const [bio, setBio] = useState(curator?.bio || bioPlaceholder);
  const [socials, setSocials] = useState(curator?.socials || []);

  const [bannerLoaded, setBannerLoaded] = useState(true);
  const [pfpLoaded, setPfpLoaded] = useState(true);
  
  const isOwner = Boolean(user && user.public_keys.includes(curator?.public_keys?.[0]) && user.api_key);
  const galleries = curator?.pro_galleries

  useEffect(() => {
    //set loaded to false when the banner changes
    if (banner !== curator?.banner_image) setBannerLoaded(false);
  }, [banner, curator?.banner_image])
  
  useEffect(() => {
    //set loaded to false when the pfp changes
    if (pfp !== curator?.profile_image) setPfpLoaded(false);
  }, [pfp, curator?.profile_image])

  const handleEditBanner = async (selectedToken) => {
    if(!isOwner) return;
    setBanner(selectedToken.mint);
    const res = await updateBannerImage(user.api_key, selectedToken.mint)
    if (res.status === "success") success("Banner Updated")
    else error("Banner update failed")
  }

  const handleEditPfp = async (selectedToken) => { 
    if (!isOwner) return;
    setPfp(selectedToken.mint);
    const res = await updateProfileImage(user.api_key, selectedToken.mint)
    if (res.status === "success") success("Profile Image Updated!")
    else error("Profile image update failed")
  }

  const handleEditBio = async (newBio) => {
    if (!isOwner) return;
    setBio(newBio);
    const res = await updateBio(user.api_key, newBio)
    console.log("🚀 ~ file: [username].js:55 ~ handleEditBio ~ res:", res)
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
        <p className="dark:text-gray-100 pt-20 text-center">Sorry, we could not find a Pro user with that name</p>
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
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${banner}`}
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
                  "w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800 border-8 border-white dark:border-black",
                  !pfpLoaded && "animate-pulse"
                )}
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ pfp }`}
                noLazyLoad
                onLoad={() => setPfpLoaded(true)}
                width={144}
                height={144}
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
        <div className="group/bio w-fit">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditBioOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/bio:opacity-100"
            // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <p className="whitespace-pre-wrap">{bio}</p>
          </EditWrapper>
        </div>

        <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
        
        {galleries?.length
          ? (
            <>
              <GalleryHighlight gallery={galleries[0]} isOwner={isOwner} />
      
              <hr className="my-12 border-neutral-200 dark:border-neutral-800" />  
              
              <GalleryList galleries={galleries.slice(1)} isOwner={isOwner}/>
            </>
          )
          : null
        }

        {isOwner
          ? (
            <MainButton
              className="mx-auto flex items-center"
              onClick={() => setCreateGalleryOpen(true)}
            >
              Create New Pro Gallery <PlusIcon className="w-6 h-6 ml-2" />
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
              bio={curator.bio}
            />
            <EditSocialsModal
              isOpen={editSocialsOpen}
              onClose={() => setEditSocialsOpen(false)}
              onSave={handleEditSocials}
              socials={curator.socials}
            />
            <CreateGalleryModal
              isOpen={createGalleryOpen}
              onClose={() => setCreateGalleryOpen(false)}
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
    ////Mocking Galleries
    const galleries = [
      {
        id: 1,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        name: "Hoops Gallery",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        available_artworks: ["EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP", "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24"],
        is_published: true,
        banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      },
      {
        id: 2,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        name: "Abstract StuffG",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        available_artworks: ["EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP", "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24"],
        is_published: true,
        banner_image: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
      },
      {
        id: 3,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        name: "Photography Exhibit",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        available_artworks: ["EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP", "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24"],
        is_published: true,
        banner_image: "86Umq7881f1QXpr91B1jPjpGMYu3CeZFFx4Rt25u5K24",
      },
      {
        id: 4,
        curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
        name: "Hoops Gallery Old",
        description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
        available_artworks: ["EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP", "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24"],
        is_published: false,
        banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      },
    ]

    ////Mocking Curator
    // const curator = {
    //   username: "Test Curator",
    //   bio: "Test Bio, this has a lot of words, so could take up a lot of space if someone want to get wordy with it\nand a there should be a line break\nand here.\nThanks for listening to my ted talk!",
    //   profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
    //   banner_image: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
    //   public_keys: ["EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"],
    //   socials: [{ type: "twitter", link: "https://twitter.com/EV3RETH" }, { type: "other", link: "https://google.com" }],
    //   pro_galleries: galleries
    // }

    let username = context.params.username;
    const res = await getUserFromUsername(username)

    const curator = res?.user;
    // curator.pro_galleries = galleries; //for mocking galleries only

    if (curator && curator?.subscription_level === "pro") {
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