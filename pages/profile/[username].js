import { useContext, useEffect, useState } from "react";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation";
import UserContext from "../../contexts/user";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import { PencilAltIcon, PhotographIcon } from "@heroicons/react/solid";
import EditImageModal from "../../components/curatorProfile/editImageModal";
import EditBioModal from "../../components/curatorProfile/editBioModal";
import GalleryHighlight from "../../components/curatorProfile/galleryHighlight";
import SocialLink from "../../components/SocialLink";
import EditSocialsModal from "../../components/curatorProfile/editSocialsModal";
import GalleryList from "../../components/curatorProfile/galleryList";
import { useRouter } from "next/router";

function ProfilePage({ curator }) {
  const router = useRouter();
  const [user] = useContext(UserContext);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);

  const [banner, setBanner] = useState(curator?.banner_image);
  const [pfp, setPfp] = useState(curator?.profile_image);
  const [bio, setBio] = useState(curator?.bio);
  const [socials, setSocials] = useState(curator?.socials);
  
  const isOwner = Boolean(user && user.public_keys.includes(curator?.public_keys?.[0]));
  const galleries = curator?.pro_galleries
  
  useEffect(() => {
    //Sending view back to homepage if no curator is found
    if(!curator) router.replace("/")
  }, [router, curator])


  const handleEditBanner = (selectedToken) => {
    setBanner(selectedToken.mint);
    //TODO Send to backend
  }

  const handleEditPfp = (selectedToken) => { 
    setPfp(selectedToken.mint);
    //TODO Send to backend
  }

  const handleEditBio = (newBio) => {
    setBio(newBio);
    //TODO Send to backend
  }

  const handleEditSocials = (newSocials) => { 
    setSocials(newSocials);
    //TODO Send to backend
  }

  if (!curator) return null;

  return (
    <>
      <MainNavigation />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
        <EditWrapper
          isOwner={isOwner}
          onEdit={() => setEditBannerOpen(true)}
          placement="inside-tr"
          groupHoverClass="group-hover/banner:opacity-100"
          icon={<PhotographIcon className="w-6 h-6" />}
        >
          <div className="w-full pb-[50%] md:pb-[33%] relative">
            <CloudinaryImage
              className="absolute inset-0 w-full h-full object-cover 2xl:rounded-b-2xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25"
              id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${banner}`}
              noLazyLoad
              width={2000}
            />
          </div>
        </EditWrapper>
        <div className="w-36 h-36 absolute -bottom-12 ml-6 lg:ml-12 2xl:ml-6 group/pfp">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditPfpOpen(true)}
            placement="tr"
            groupHoverClass="group-hover/pfp:opacity-100"
            icon={<PhotographIcon className="w-6 h-6" />}
          >
            <CloudinaryImage
              className="w-36 h-36 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800 border-8 border-white dark:border-black"
              id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ pfp }`}
              noLazyLoad
              width={144}
              height={144}
            />
          </EditWrapper>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-16">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <h1 className="font-bold text-5xl mr-6">{curator.username}</h1>
          <EditWrapper
            className="max-w-fit"
            isOwner={isOwner}
            onEdit={() => setEditSocialsOpen(true)}
            placement="outside-tr"
            icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <div className="flex items-center gap-2">
              {socials.map((social, index) => (
                <SocialLink
                  key={social.type + index}
                  link={social.link} type={social.type}
                />
              ))}
            </div>
          </EditWrapper>
        </div>
        <div className="group/bio">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditBioOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/bio:opacity-100"
            icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <p className="whitespace-pre-wrap">{bio}</p>
          </EditWrapper>

        </div>

        {galleries?.length
          ? (
            <>
              <hr className="my-12 border-neutral-200 dark:border-neutral-800"/>
      
              <GalleryHighlight gallery={galleries[0]} isOwner={isOwner} />
      
              <hr className="my-12 border-neutral-200 dark:border-neutral-800" />  
              
              <GalleryList galleries={galleries.slice(1)} isOwner={isOwner}/>
            </>
          )
          : null
        }

      </div>
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
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    let username = context.params.username;
    console.log("🚀 ~ file: [username].js:13 ~ getServerSideProps ~ username:", username)
    // const curator = await getCuratorByUsername(username);


    //Mocking Galleries
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

    //Mocking Curator
    const curator = {
      username: "Test Curator",
      bio: "Test Bio, this has a lot of words, so could take up a lot of space if someone want to get wordy with it\nand a there should be a line break\nand here.\nThanks for listening to my ted talk!",
      profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
      banner_image: "24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24",
      public_keys: ["EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"],
      socials: [{ type: "twitter", link: "https://twitter.com/EV3RETH" }, { type: "other", link: "https://google.com" }],
      pro_galleries: galleries
    }


   
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