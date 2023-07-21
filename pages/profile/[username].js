import { useContext, useState } from "react";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation";
import UserContext from "../../contexts/user";
import EditWrapper from "../../components/curatorProfile/editWrapper";
import { PencilAltIcon, PhotographIcon } from "@heroicons/react/solid";
import EditImageModal from "../../components/curatorProfile/editImageModal";
import EditBioModal from "../../components/curatorProfile/editBioModal";

function ProfilePage({ curator }) {
  const [user] = useContext(UserContext);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editPfpOpen, setEditPfpOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);

  const isOwner = Boolean(user && user.public_keys.includes(curator?.public_keys?.[0]));

  const handleEditBanner = (selectedToken) => {
    console.log("🚀 selectedToken:", selectedToken)
    alert("Edit Banner placeholder", selectedToken)

    setEditBannerOpen(false);
  }

  const handleEditPfp = (selectedToken) => { 
    console.log("🚀 selectedToken:", selectedToken)
    alert("Edit Pfp placeholder", selectedToken)

    setEditPfpOpen(false);
  }

  const handleEditBio = (newBio) => {
    console.log("🚀 newBio:", newBio)
    alert("Edit Bio placeholder", newBio)

    setEditBioOpen(false);
  }

  return (
    <>
      <MainNavigation />
      <div className="relative h-[500px] w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
        <EditWrapper
          isOwner={isOwner}
          onEdit={() => setEditBannerOpen(true)}
          placement="inside-tr"
          groupHoverClass="group-hover/banner:opacity-100"
          icon={<PhotographIcon className="w-6 h-6" />}
        >
          <CloudinaryImage
            className="w-full h-full object-cover 2xl:rounded-b-2xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25"
            id={curator.banner_image}
            noLazyLoad
            width={2000}
            height={500}
          />
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
              id={curator.profile_image}
              noLazyLoad
              width={144}
              height={144}
            />
          </EditWrapper>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-12">
        <h1 className="font-bold text-5xl mb-6">{curator.username}</h1>
        <div className="group/bio">
          <EditWrapper
            isOwner={isOwner}
            onEdit={() => setEditBioOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/bio:opacity-100"
            icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <p className="whitespace-pre-wrap">{curator.bio}</p>
          </EditWrapper>

        </div>
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
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    let username = context.params.username;
    console.log("🚀 ~ file: [username].js:13 ~ getServerSideProps ~ username:", username)
    // const curator = await getCuratorByUsername(username);

    //Mocking Curator
    const curator = {
      username: "Test Curator",
      bio: "Test Bio, this has a lot of words, so could take up a lot of space if someone want to get wordy with it\nand a there should be a line break\nand here.\nThanks for listening to my ted talk!",
      profile_image: "nft-9/EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP.gif",
      banner_image: "nft-9/24KpSGXNemEF42dGKGXPf9ufAafW3SPZxRzSu5ERtf24.png",
      public_keys: ["EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"]
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