import { Toaster } from "react-hot-toast";
import CheckLoggedIn from "../components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import { useRouter } from "next/router";
import Link from "next/link";
import MainButton from "../components/MainButton";
import FileDrop, { CATEGORIES, imageFormats } from "../components/FileDrop";
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


//TODO
// Attributes: 
// external_url: 
// isMutable
// Collection

//NFT standard reference - https://docs.metaplex.com/programs/token-metadata/changelog/v1.0

const maxUploadSize = 123 //MB

export const REQUIRED = "required"

const nonDisplayErrors = [REQUIRED]

const MEDIA_KEYS = {
  MAIN: "primary media",
  THUMB: "thumbnail image",
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

  const [mintModalOpen, setMintModalOpen] = useState(false)
  const [reseting, setReseting] = useState(false)

  const [error, setError] = useState({
    name: REQUIRED,
    description: REQUIRED,
    royalties: REQUIRED,
    [MEDIA_KEYS.MAIN]: REQUIRED,
  })

  const usingAltMedia = category !== CATEGORIES.IMAGE
  const isError = Object.values(error).some(v => v)
  const errors = Object.entries(error)
  const requiredError = errors.filter(e => nonDisplayErrors.includes(e[1]))[0]

  useEffect(() => {
    if (!user) return
    if (!user.curator_approved || user.subscription_level !== "pro") router.replace("/");
  }, [user, router])

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
  }, [wallet, creators])

  const onMainDrop = (file) => {
    let fileCategory = CATEGORIES.IMAGE
    if (file.type.includes("video")) fileCategory = CATEGORIES.VIDEO
    if (file.type.includes("html")) fileCategory = CATEGORIES.HTML

    //TODO does this need file.type.includes("glb") ?
    if (file.type.includes("model")) fileCategory = CATEGORIES.VR

    setCategory(fileCategory)

    setError(prev => ({ ...prev, [MEDIA_KEYS.MAIN]: null }))

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

  const onReset = () => { 
    setReseting(true)
    setImageFile(null)
    setCategory(CATEGORIES.IMAGE)
    setName("")
    setDescription("")
    setRoyalties("")
    setCreators([])
    setMaxSupply(0)

    setError({
      name: REQUIRED,
      description: REQUIRED,
      royalties: REQUIRED,
      "main asset": REQUIRED,
    })
    
    //wait till lifecycle completes so it triggers a new FileDrop
    setTimeout(() => setReseting(false), 500)
  }

  const openMintModal = () => setMintModalOpen(true)
  const closeMintModal = () => setMintModalOpen(false)


  return (
    <>
      <CheckLoggedIn />
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
          // attributes,
          // external_url
        }}
      />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 px-4">
          <h2 className="text-5xl font-bold">Create</h2>
          <Link href="/submissions" passHref>
            <MainButton solid>
              Submissions
            </MainButton>
          </Link>
        </div>

        <hr className="mt-6 mb-12 border-neutral-200 dark:border-neutral-800" />

        <div 
          className={clsx(
            "px-4 grid grid-cols-1 gap-6",
            usingAltMedia ? "lg:grid-cols-3" : "",
          )}
        >
          {!reseting
            ? (
              <div className="flex flex-col gap-2 h-[50vh] lg:col-span-2">
                {usingAltMedia ? <p className="text-center font-bold text-lg capitalize">{category}</p> : null}
                <FileDrop
                onDrop={onMainDrop}
                imageClass="object-contain p-2"
                maxFileSize={maxUploadSize}
                acceptableFiles={{
                  ...imageFormats,
                  "video/mp4": [],
                }}
                />
              </div>
            )
            : null
          }
          {(usingAltMedia && !reseting)
            ? (
              <div className="flex flex-col gap-2 h-[25vh] w-full">
                <p className="text-center font-bold text-lg">Thumbnail Image</p>
                <FileDrop
                  onDrop={onThumbnailDrop}
                  imageClass="object-contain p-2 mx-auto"
                  maxFileSize={maxUploadSize}
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
            <NftTypeInput maxSupply={maxSupply} setMaxSupply={setMaxSupply} setError={setError} />
          </div>

          <DescriptionInput description={description} setDescription={setDescription} setError={setError}/>
        
          <div className="grid lg:grid-cols-2 gap-4">
            <RoyaltiesInput royalties={royalties} setRoyalties={setRoyalties} setError={setError} />
            <CreatorsInput creators={creators} setCreators={setCreators} setError={setError} />
          </div>  
          
          <Tippy 
            disabled={!isError || !requiredError}
            content={<p className="capitalize">{requiredError?.[0]} is {requiredError?.[1]}</p>}
          >
            <div className="mt-4">
              <MainButton
                solid disabled={isError} className="w-full hover:scale-[102%]"
                onClick={openMintModal}
              >
                Mint!
              </MainButton>
            </div>
          </Tippy>
          <div className="h-10">
            {(errors.filter(e => !nonDisplayErrors.includes(e[1]))
              .map((e, i) => {
              return <p key={e[0]} className="text-red-500 text-sm my-2 ml-2">{e[1]}</p>
            }))}
          </div>
        </div>

      </div>
    </>
  )
}
