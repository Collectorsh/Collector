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
import TextModule from "../../components/proGallery/textModule";
import Link from "next/link";
import ArtModule from "../../components/proGallery/artModule";

function ProGalleryPage({ gallery, curator }) {
  const [user] = useContext(UserContext);

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);

  const [name, setName] = useState(gallery?.name);
  const [banner, setBanner] = useState(gallery?.banner_image);
  const [description, setDescription] = useState(gallery?.description);
  const [content, setContent] = useState(gallery?.content || []);

  const [bannerLoaded, setBannerLoaded] = useState(true);

  //TODO: connect to websocket for listing updates

  const isOwner = Boolean(user && user.public_keys.includes(gallery?.curator_address) && user.api_key);
  const displayGallery = Boolean(gallery?.is_published || isOwner);

  useEffect(() => {
    //set loaded to false when the banner changes
    if (banner !== gallery?.banner_image) setBannerLoaded(false);
  }, [banner, gallery?.banner_image])

  const handleEditName = async (newName) => {
    if (!isOwner) return;
    setName(newName);

    //TODO create update Name API route
    // const res = await updateGalleryName(user.api_key, newName)
    // if (res.status === "success") success("Gallery Name Updated!")
    // else error("Gallery Name update failed")
    //router.replace(`/pro/${ newName }`)
  }

  const handleEditDescription = async (newDescription) => {
    if (!isOwner) return;
    setDescription(newDescription);

    //TODO create update description API route
    // const res = await updateGalleryDescription(user.api_key, newDescription)
    // if (res.status === "success") success("Description Updated!")
    // else error("Description update failed")
  }

  const handleEditBanner = async (newToken) => { 
    if (!isOwner) return;
    setBanner(newToken.mint);

    //TODO create update banner API route
    // const res = await updateGalleryBanner(user.api_key, newToken.mint)
    // if (res.status === "success") success("Banner Updated!")
    // else error("Banner update failed")
  }

  const handleEditContent = async (newContent) => { 
    if (!isOwner) return;
    setContent(newContent);

    //TODO create update content API route
    // const res = await updateGalleryContent(user.api_key, newContent)
    // if (res.status === "success") success("Gallery Content Updated!")
    // else error("Gallery content update failed")
  }

  const handleEditModule = (newModule, index) => {
    const newContent = [...content];
    newContent[index] = newModule;
    handleEditContent(newContent);
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
            isOwner={isOwner}
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
            isOwner={isOwner}
            onEdit={() => setEditDescriptionOpen(true)}
            placement="outside-tr"
            groupHoverClass="group-hover/description:opacity-100"
          // icon={<PencilAltIcon className="w-6 h-6" />}
          >
            <p className="whitespace-pre-wrap text-center">{description}</p>
          </EditWrapper>
        </div>

        <hr className="my-12 border-neutral-200 dark:border-neutral-800" />

        <div className="grid grid-cols-1 gap-4 p-4">
          {content.map((item, i) => {
            switch (item.type) {
              case "text": {
                return <TextModule
                  key={item.type + i}
                  textModule={item}
                  onNewTextModule={(newTM) => handleEditModule(newTM, i)}
                  isOwner={isOwner}
                />
              }
              case "art": {
                return <ArtModule
                  key={item.type + i}
                  artModule={item}
                  onNewArtModule={(newAM) => handleEditModule(newAM, i)}
                  isOwner={isOwner}
                  submittedTokens={gallery.submitted_tokens}
                />
              }
            }
          })}
        </div>
      
      </div>
      {isOwner && (
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
        </>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    ////Mocking Galleries
    const gallery = {
      id: 1,
      curator_address: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX",
      name: "Hoops_Gallery",
      description: "Gallery Description goes here, where you can talk all about why you made this gallery and what it means to you. A few things to look out for, themes and such.\n\nBut dont say too much cause you will have plenty of time to explain each piece in the gallery it self",
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
      banner_image: "2DrSghx7ueY4iQjXdrSj1zpH4u9pGmLrLx53iPRpY2q2",
      curator: {
        username: "EV3",
        profile_image: "EP8gUvR2ZH5iB5QonbGYcuzwpcGesWoy8kSxdtMfzKoP",
      },
      content: [
        { type: "text", textDelta: JSON.stringify({ "ops": [{ "insert": "This is a text block" }] }) },
        { type: "text", textDelta: "{}" },
        {
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
        {type: "art", tokens: []}
      ]
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