import { Toaster } from "react-hot-toast";
import CheckLoggedIn from "../components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import { useRouter } from "next/router";
import Link from "next/link";
import MainButton from "../components/MainButton";
import FileDrop, { CATEGORIES, imageFormats, isGLB } from "../components/FileDrop";
import DescriptionInput from "../components/create/description";
import NameInput from "../components/create/name";
import RoyaltiesInput from "../components/create/royalties";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useWallet } from "@solana/wallet-adapter-react";
import CreatorsInput from "../components/create/creators";
import MintModal from "../components/create/mintModal";
import clsx from "clsx";
import NftTypeInput from "../components/create/nftType";
import { Oval } from "react-loader-spinner";
import CollectionDropDown from "../components/create/collectionDropDown";
import { connection } from "../config/settings";
import { Metaplex } from "@metaplex-foundation/js";
import axios from "axios";
import Drawer from "../components/Drawer";
import IsMutableSwitch from "../components/create/isMutableSwitch";
import ExternalUrlInput from "../components/create/externalUrl";
import AttributesInput from "../components/create/attributes";
//NFT standard reference - https://docs.metaplex.com/programs/token-metadata/changelog/v1.0

export const maxUploadSize = 123 //MB

export const REQUIRED = "required"

const nonDisplayErrors = [REQUIRED]

const MEDIA_KEYS = {
  MAIN: "primary media",
  THUMB: "thumbnail image",
}

const initError = {
  name: REQUIRED,
  royalties: REQUIRED,
  // collection: REQUIRED,
  [MEDIA_KEYS.MAIN]: REQUIRED,
}

async function getCollectionNFTs(userPublicKey) {
  try {
    const metaplex = Metaplex.make(connection);
    const nfts = await metaplex.nfts().findAllByOwner({ owner: userPublicKey })
      
    const collections = nfts.filter((nft) => nft.collectionDetails)
      
    return await Promise.all(collections
      .map(async (nft) => {
        let image = undefined;
        try {
          image = await axios(nft.uri).then(res => res.data.image)
        } catch (e) {
          console.log("failed to load collection image", e);
        }

        return {
          mint: nft.mintAddress.toString(),
          name: nft.name,
          image
        }
      })
    )
  } catch (e) {
    console.log("failed to load collection nfts", e);
    return []
  }
}

export default function MintPage() {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const wallet = useWallet();

  const [altMediaFile, setAltMediaFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [category, setCategory] = useState("image")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [royalties, setRoyalties] = useState("")
  const [creators, setCreators] = useState([]);
  const [maxSupply, setMaxSupply] = useState(0);

  const [existingCollections, setExistingCollections] = useState()
  const [collection, setCollection] = useState(null)

  const [isMutable, setIsMutable] = useState(true)
  const [externalUrl, setExternalUrl] = useState("")
  const [attributes, setAttributes] = useState([])

  const [mintModalOpen, setMintModalOpen] = useState(false)
  const [reseting, setReseting] = useState(false)

  const [error, setError] = useState(initError)

  const usingAltMedia = category !== CATEGORIES.IMAGE
  const isError = Object.values(error).some(v => v)
  const errors = Object.entries(error)
  const requiredError = errors.filter(e => nonDisplayErrors.includes(e[1]))[0];
  const categoryDisplay = category === CATEGORIES.VR ? "3D Model" : category
  const isEditions = maxSupply > 1

  const permitted = true//user?.subscription_level === "pro" || user?.curator_approved

  useEffect(() => {
    if (!user) {
      setCreators([])
      return
    } 
    // if (permitted) {
    //   setError(prev => ({ ...prev, "permission": null }))
    // } else {
    //   setError(prev => ({ ...prev, "permission": "You must be have an approved account to mint" }))
    // }
  }, [user, permitted])

  useEffect(() => {
    if (!wallet.publicKey) setError(prev => ({ ...prev, "Primary Creator": "Error Connecting Wallet" }))
    if (!wallet.publicKey || creators?.length) return

    setError(prev => ({
      ...prev,
      "Primary Creator": null
    }))

    setCreators([{
      address: wallet.publicKey,
      verified: true,
      share: 100,
    }])
  }, [wallet.publicKey, creators, user?.username])

  useEffect(() => {
    if (!wallet.publicKey) return

    (async () => {
      const nfts = await getCollectionNFTs(wallet.publicKey)
      const sortedNfts = nfts.sort((a, b) => a.name.localeCompare(b.name))
      setExistingCollections(sortedNfts)
    })();
  }, [wallet.publicKey])

  const onReset = () => {
    setReseting(true)
    setImageFile(null)
    setCategory(CATEGORIES.IMAGE)
    setName("")
    setDescription("")
    setRoyalties("")
    setCreators([])
    setMaxSupply(0)
    setIsMutable(true)

    setError(initError)

    //wait till lifecycle completes so it triggers a new FileDrop
    setTimeout(() => setReseting(false), 500)
  }


  const onMainDrop = (file) => {
    let fileCategory = CATEGORIES.IMAGE
    if (file.type.includes("video")) fileCategory = CATEGORIES.VIDEO
    if (file.type.includes("html")) fileCategory = CATEGORIES.HTML
    if (isGLB(file)) fileCategory = CATEGORIES.VR

    setCategory(fileCategory)

    setError(prev => ({
      ...prev,
      [MEDIA_KEYS.MAIN]: null,
      [MEDIA_KEYS.THUMB]: null
    }))

    if (fileCategory === CATEGORIES.IMAGE) setImageFile(file);
    else {
      setAltMediaFile(file);
      setError(prev => ({ ...prev, [MEDIA_KEYS.THUMB]: REQUIRED }))
    }
  }

  const onThumbnailDrop = (file) => { 
    setImageFile(file)
    setError(prev => ({ ...prev, [MEDIA_KEYS.THUMB]: null }))
  }


  const openMintModal = () => setMintModalOpen(true)
  const closeMintModal = () => setMintModalOpen(false)


  return (
    <>
      <MainNavigation />
      <Toaster />
      <MintModal
        onReset={onReset}
        isOpen={mintModalOpen}
        onClose={closeMintModal}
        nftProps={{
          altMediaFile,
          imageFile,
          category,
          creators,
          name,
          description,
          royalties,
          maxSupply,
          collection,
          isMutable,
          attributes,
          externalUrl
        }}
      />
      <div className="relative w-full max-w-screen-lg  mx-auto px-6 sm:px-11 py-12">
        <h2 className="text-5xl font-bold">Mint</h2>

        <p className="my-4">
          Due to the current network congestion, minting may fail. We apologize for this inconvenience and recommend trying again later if your mint fails. If you continue to experience issues please contact us on <a href="https://twitter.com/collector_sh" target="_blank" rel="noreferrer" className="underline">Twitter</a>
        </p>
        

        <hr className="mt-6 mb-12 borderPalette2" />

        <div 
          className={clsx(
            "px-4 grid grid-cols-1 gap-6",
            usingAltMedia ? "lg:grid-cols-3" : "",
          )}
        >
          {!reseting
            ? (
              <div className="flex flex-col gap-2 h-[50vh] lg:col-span-2">
                {
                  usingAltMedia
                    ? <p className="text-center font-bold text-lg capitalize">{categoryDisplay}</p>
                    : null
                }
                <FileDrop
                onDrop={onMainDrop}
                imageClass="object-contain p-2"
                maxFileSize={maxUploadSize}
                acceptableFiles={{
                  ...imageFormats,
                  "video/mp4": [],
                  "text/html": [],
                  "model/gltf-binary": [".glb"],
                }}
                />
              </div>
            )
            : null
          }
          {(usingAltMedia && !reseting)
            ? (
              <div className="flex flex-col gap-2 h-[33vh] w-full">
                <p className="text-center font-bold text-lg">Thumbnail Image</p>
                <FileDrop
                  onDrop={onThumbnailDrop}
                  imageClass="object-contain p-2 mx-auto"
                />
              </div>
            )
            : null
          }
        </div>


        <div
          className="mt-5 px-4 mx-auto flex flex-col gap-1"
        >
         
          <div className="grid lg:grid-cols-2 gap-4">
            <NameInput name={name} setName={setName} setError={setError} />
            <NftTypeInput
              maxSupply={maxSupply}
              setMaxSupply={setMaxSupply}
              setError={setError}
              setIsMutable={setIsMutable}
            />
          </div>

          <DescriptionInput description={description} setDescription={setDescription} setError={setError}/>
        
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <RoyaltiesInput royalties={royalties} setRoyalties={setRoyalties} setError={setError} />
              <CollectionDropDown
                className="hidden lg:block"
                selectedCollection={collection} setCollection={setCollection} existingCollections={existingCollections} setError={setError}
              />
            </div>

            <CreatorsInput creators={creators} setCreators={setCreators} setError={setError} />

            <CollectionDropDown
              className="lg:hidden"
              selectedCollection={collection} setCollection={setCollection} existingCollections={existingCollections} setError={setError}
            />
          </div>  

          {/* <div className="flex justify-center w-full lg:w-[calc(50%-8px)] mx-auto">
            <CollectionDropDown selectedCollection={collection} setCollection={setCollection} existingCollections={existingCollections} setError={setError} />
          </div> */}

          <Drawer
            title="Extras"
            drawerClass="rounded-lg border-2 border-neutral-200 dark:border-neutral-800"
            buttonClass="font-bold text-lg my-2 mx-auto"
          >
            <div className="flex flex-col gap-4">
              {!isEditions ? (
                <IsMutableSwitch isMutable={isMutable} setIsMutable={setIsMutable} />
              ): null}
              <ExternalUrlInput externalUrl={externalUrl} setExternalUrl={setExternalUrl} />
              <AttributesInput attributes={attributes} setAttributes={setAttributes} />
            </div>
          </Drawer>
          
          <Tippy 
            disabled={!isError || !requiredError}
            content={<p className="capitalize">{requiredError?.[0]} is {requiredError?.[1]}</p>}
          >
            <div className="mt-4">
              <MainButton
                solid disabled={isError} className="w-full"
                size="xl"
                onClick={openMintModal}
              >
                {mintModalOpen
                  ? (
                    <span className="inline-block translate-y-0.5">
                      <Oval color="#FFF" secondaryColor="#666" height={17} width={17} strokeWidth={2.5} />
                    </span>
                  )
                  : "Mint!"
                }
              </MainButton>
            </div>
          </Tippy>
          <div className="h-10">
            {(errors.filter(e => !nonDisplayErrors.includes(e[1]))
              .map((e, i) => {
              return <p key={e[0]} className="text-amber-500 text-sm my-2 ml-2">{e[1]}</p>
            }))}
          </div>
        </div>

      </div>
    </>
  )
}
