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
import clsx from "clsx";
import { makeTxWithPriorityFeeFromMetaplexBuilder } from "../../utils/solanaWeb3/priorityFees";
import { signAndConfirmTx } from "../../utils/solanaWeb3/signAndConfirm";
import { RoundedCurve } from "../curations/roundedCurveSVG";

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
      const uploadMetadataRes = await apiNodeClient.post(
        "upload-collection-metadata",
        fileData,
        { timeout: 0 }
      ).then(res => res.data)

      if (uploadMetadataRes.error || !uploadMetadataRes.uri) {
        throw new Error(`Error uploading collection metadata: ${ uploadMetadataRes?.error }`)
      }

      setStage(MINT_STAGE.MINTING)

      const { uri, metadata } = uploadMetadataRes

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))

      const transactionBuilder = await metaplex.nfts().builders().create({
        uri, 
        name: collectionName,
        isCollection: true
      });

      const { mintAddress } = transactionBuilder.getContext();

      const createTx = await makeTxWithPriorityFeeFromMetaplexBuilder(transactionBuilder, wallet.publicKey)

      await signAndConfirmTx({
        tx: createTx,
        errorMessage: "Error confirming Create Collection tx",
        wallet,
        commitment: "finalized"
      })


      //munged into collection format
      const newCollection = {
        mint: mintAddress.toString(),
        ...metadata
      }

      setCollections(prev => [...prev, newCollection])

      setStage(MINT_STAGE.SUCCESS)
      shootConfetti(2)
    } catch (e) {
      console.error("Error minting NFT: ", e);
      setStage(MINT_STAGE.ERROR)
    }
  }, [wallet, imageFile, collectionName, collectionDescription, setCollections])

  const content = useMemo(() => {
 
    switch (stage) {
      case MINT_STAGE.INIT: return (
        <div className="flex flex-col gap-0">
          {/* <p className="text-center font-bold text-lg mb-2">Collection Image</p> */}
          <div className="relative mx-auto w-fit">
            <p className="font-bold bg-neutral-300 dark:bg-neutral-700 h-5">Collection Image</p>
            <RoundedCurve className="absolute bottom-0 -left-10 w-10 h-5 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1]" />
            <RoundedCurve className="absolute bottom-0 -right-10 w-10 h-5 fill-neutral-300 dark:fill-neutral-700" />
          </div>
          <div className="h-[40vh] w-full mb-4 palette2 borderPalette3 border-4 rounded-lg p-2">

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
            placeholder="The title of your collection"
            paletteClass="palette2 borderPalette3"
          />
          <DescriptionInput
            description={collectionDescription}
            setDescription={setCollectionDescription}
            setError={() => { }}
            placeholder="Your collection's description"
            paletteClass="palette2 borderPalette3"
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
        <MainButton onClick={onMint} solid disabled={disableCreate} size="lg" standardWidth>
          Create
        </MainButton>
      )
      case MINT_STAGE.ERROR: return (
        <MainButton onClick={onMint} solid disabled={disableCreate} size="lg" standardWidth>
          Retry
        </MainButton>
      ) 
      case MINT_STAGE.SUCCESS: return () => null;
      default: return (
        <MainButton solid disabled size="lg" standardWidth>
          <span className="inline-block translate-y-0.5">
            <Oval color="#FFF" secondaryColor="#666" strokeWidth={2.5} height={17} width={17} />
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
      title={`Create A New Collection`}
      widthClass={"max-w-screen-sm"}
    >
      <div className="h-full overflow-y-auto my-2">
        {content}
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className={clsx(
            "justify-self-end",
          MINT_STAGE.SUCCESS === stage && "col-span-2 w-full flex justify-center"
          )}
        >
          <MainButton
            onClick={handleClose}
            size="lg" standardWidth
          >
            {MINT_STAGE.SUCCESS === stage ? "Return" : "Cancel"}
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