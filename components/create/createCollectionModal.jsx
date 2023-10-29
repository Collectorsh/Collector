import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "../Modal";
import { useCallback, useContext, useMemo, useState } from "react";
import UserContext from "../../contexts/user";
import MainButton from "../MainButton";
import { Oval } from "react-loader-spinner";
import FileDrop from "../FileDrop";
import NameInput from "./name";
import { MINT_STAGE } from "./mintModal";
import DescriptionInput from "./description";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { apiNodeClient } from "../../data/client/apiClient";
import { connection } from "../../config/settings";
import { shootConfetti } from "../../utils/confetti";

const CreateCollectionModal = ({ isOpen, onClose, setCollections }) => {
  const wallet = useWallet();

  const [stage, setStage] = useState(MINT_STAGE.INIT)
  const [imageFile, setImageFile] = useState(null)
  const [collectionName, setCollectionName] = useState("")
  const [collectionDescription, setCollectionDescription] = useState("")

  const preventClose = [MINT_STAGE.UPLOAD, MINT_STAGE.SIGN, MINT_STAGE.MINTING].includes(stage)
  const disableCreate = !imageFile || !collectionName || collectionName?.length > 32 || collectionDescription?.length > 1000

  const resetLocally = () => {
    setStage(MINT_STAGE.INIT)
    setCollectionName("")
    setCollectionDescription("")
  }

  const handleClose = useCallback(() => {
    if (preventClose) return
    onClose()
    setTimeout(() => resetLocally(), 500) //wait for modal to close before resetting so the content doesn't change while closing
  }, [onClose, preventClose])

  const onMint = useCallback(async () => {
    if (!wallet) return;
    
    setStage(MINT_STAGE.UPLOAD)

    const fileData = new FormData()
    fileData.append("imageFile", imageFile)

    fileData.append("nft", JSON.stringify({
      collectionName,
      collectionDescription 
    }))

    try {
      const res = await apiNodeClient.post(
        "upload-collection-metadata",
        fileData,
        { timeout: 0 }
      ).then(res => res.data)

      if (res.error || !res.uri) {
        throw new Error(`Error uploading metadata: ${ res?.error }`)
      }

      setStage(MINT_STAGE.MINTING)

      const uri = res.uri

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))

      const transactionBuilder = await metaplex.nfts().builders().create({
        uri, 
        name: collectionName,
        isCollection: true
      });

      const { mintAddress } = transactionBuilder.getContext();
      const { signature, confirmResponse } = await metaplex.rpc().sendAndConfirmTransaction(
        transactionBuilder,
        { commitment: "finalized" }
      )

      if (!signature || Boolean(confirmResponse?.value?.err)) {
        throw new Error("Error minting NFT")
      }

      await new Promise(resolve => setTimeout(resolve, 2000)) //give the tx time to settle before fetching

      const newNft = await metaplex.nfts().findByMint({ mintAddress });

      if (!newNft) {
        throw new Error("Error getting minted NFT")
      }

      //munged into collection format
      const newCollection = {
        mint: newNft.address.toString(),
        ...newNft.json
      }

      setCollections(prev => [...prev, newCollection])

      setStage(MINT_STAGE.SUCCESS)
      shootConfetti(1)
    } catch (e) {
      console.error("Error minting NFT: ", e);
      setStage(MINT_STAGE.ERROR)
    }
  }, [wallet, imageFile, collectionName, collectionDescription, setCollections])

  const content = useMemo(() => {
 
    switch (stage) {
      case MINT_STAGE.INIT: return (
        <div className="flex flex-col gap-0">
          <div className="flex flex-col gap-2 h-[40vh] w-full mb-4">
            <p className="text-center font-bold text-lg">Collection Image</p>
            <FileDrop
              onDrop={setImageFile}
              imageClass="object-contain p-2 mx-auto"
              maxFileSize={50}
            />
          </div>
          <NameInput
            name={collectionName}
            setName={setCollectionName}
            setError={() => { }}
            placeholder="What is the title of your collection."
          />
          <DescriptionInput
            description={collectionDescription}
            setDescription={setCollectionDescription}
            setError={() => { }}
            placeholder="Describe your collection."
          />
          
        </div>
      )
      case MINT_STAGE.SUCCESS: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold">The {collectionName} Collection has been created!</p>
        </div>
      )
      case MINT_STAGE.ERROR: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold">Sorry, there was an error creating the {collectionName} collection onchain.</p>
          <p className="text-center">Please, make sure your internet connection is stable and then try again.</p>
        </div>
      )

      default: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold animate-pulse">{stage}</p>
          {stage === MINT_STAGE.MINTING ? (
            <p className="text-center">Sign the transaction to create the {collectionName} collection onchain.</p>
          ) : (
            <p className="text-center">This may take a few minutes.</p>
          )}
          <p className="text-center">Please stay on this page until the mint process has finished.</p>
        </div>
      )
    }
  }, [stage, collectionName, collectionDescription])



  const actionButton = useMemo(() => {
    switch (stage) {
      case MINT_STAGE.INIT: return (
        <MainButton onClick={onMint} solid disabled={disableCreate}>
          Create!
        </MainButton>
      )
      case MINT_STAGE.ERROR: return (
        <MainButton onClick={onMint} solid disabled={disableCreate}>
          Retry
        </MainButton>
      )
      default: return (
        <MainButton solid disabled>
          <span className="inline-block translate-y-0.5">
            <Oval color="#FFF" secondaryColor="#666" height={17} width={17} />
          </span>
        </MainButton>
      )
    }
  }, [stage, onMint, disableCreate])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeDisabled={preventClose}
      title={`Create New Collection`}
      widthClass={"max-w-screen-sm"}
    >
      <div className="h-full overflow-y-auto my-2">
        {content}
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="justify-self-end">
          <MainButton onClick={handleClose}>
            Cancel
          </MainButton>
        </div>
        <div>
          {actionButton}
        </div>
      </div>
    </Modal>
  )
}

export default CreateCollectionModal