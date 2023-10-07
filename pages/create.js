import { Toaster } from "react-hot-toast";
import CheckLoggedIn from "../components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import { useRouter } from "next/router";
import Link from "next/link";
import MainButton from "../components/MainButton";
import FileDrop from "../components/FileDrop";
import DescriptionInput from "../components/create/description";
import NameInput from "../components/create/name";
import NotFound from "../components/404";
import RoyaltiesInput from "../components/create/royalties";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useWallet } from "@solana/wallet-adapter-react";
import CreatorsInput from "../components/create/creators";
import { apiNodeClient } from "../data/client/apiClient";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { connection } from "../config/settings";
import { success } from "../utils/toast";
import { shootConfetti } from "../utils/confetti";
import MintModal from "../components/create/mintModal";

export const REQUIRED = "required"
const nonDisplayErrors = [REQUIRED]

//NFT standard reference - https://docs.metaplex.com/programs/token-metadata/changelog/v1.0

export default function MintPage() {
  const [user] = useContext(UserContext);
  const router = useRouter()
  const wallet = useWallet();

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
    "main asset": REQUIRED,
  })

  const isError = Object.values(error).some(v => v)
  const errors = Object.entries(error)
  const requiredError = errors.filter(e => nonDisplayErrors.includes(e[1]))[0]

  useEffect(() => {
    if (!user) return
    if (!user.curator_approved || user.subscription_level !== "pro") router.replace("/");
  }, [user, router])

  useEffect(() => {
    if (!wallet.publicKey || creators?.length) return
    setCreators([{
      address: wallet.publicKey,
      share: 100,
    }])
  }, [wallet, creators])

  const onDrop = (imageFile) => {
    let fileCategory = "image"
    if (imageFile.type.includes("video")) fileCategory = "video"
    if (imageFile.type.includes("html")) fileCategory = "html"
    if (imageFile.type.includes("model")) fileCategory = "vr" //TODO does this need imageFile.type.includes("glb") ?
    setCategory(fileCategory)

    setError(prev => ({ ...prev, "main asset": null }))
    setImageFile(imageFile);
  }

  const onReset = () => { 
    setReseting(true)
    setImageFile(null)
    setCategory("image")
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

        <div className="h-[50vh] relative px-4">
          {!reseting
            ? <FileDrop onDrop={onDrop} imageClass="object-contain p-2" maxFileSize={100} />
            : null
          }
        </div>

        <div
          className="mt-5 px-4 mx-auto flex flex-col gap-1"
        >
          <NameInput name={name} setName={setName} setError={setError} />

          <DescriptionInput description={description} setDescription={setDescription} setError={setError}/>
        
          <div className="grid lg:grid-cols-2 gap-4">
            <RoyaltiesInput royalties={royalties} setRoyalties={setRoyalties} setError={setError} />
            <CreatorsInput creators={creators} setCreators={setCreators} setError={setError} />
          </div>  
          <p className="font-bold ">external_url: </p>  
          <p className="font-bold ">Attributes: </p>  
          <p className="font-bold ">isMutable</p>
          <p className="font-bold ">Collection</p>
          <p className="font-bold ">1/1 or editions</p>
                  
          <Tippy 
            disabled={!isError || !requiredError}
            content={<p className="capitalize">{requiredError?.[0]} is {requiredError?.[1]}</p>}
          >
            <div>
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
