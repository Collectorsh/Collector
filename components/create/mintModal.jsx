import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import MainButton from "../MainButton"
import Modal, { modalActionDivClass } from "../Modal"
import apiClient, { apiNodeClient } from "../../data/client/apiClient"
import { Metaplex, PublicKey, toBigNumber, walletAdapterIdentity } from "@metaplex-foundation/js"
import { connection } from "../../config/settings"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { Oval } from "react-loader-spinner"
import { truncate } from "../../utils/truncate"
import { shootConfetti } from "../../utils/confetti"
import { AltMedia, CATEGORIES } from "../FileDrop"
import clsx from "clsx"
import UserContext from "../../contexts/user"
import createMintedIndex from "../../data/minted_indexer/create"
import retryFetches from "../../utils/curations/retryFetches"
import { makeTxWithPriorityFeeFromMetaplexBuilder } from "../../utils/solanaWeb3/priorityFees"
import { signAndConfirmTx } from "../../utils/solanaWeb3/signAndConfirm"



export const MINT_STAGE = {
  INIT: "Init",
  UPLOAD: "Uploading...",
  MINTING: "Minting...",
  SUCCESS: "Success",
  ERROR: "Error"
}

const MintModal = ({ nftProps, isOpen, onClose, onReset }) => {
  const wallet = useWallet();
  const [user] = useContext(UserContext);

  const [stage, setStage] = useState(MINT_STAGE.INIT)
  const [previewImage, setPreviewImage] = useState(null)
  const [previewAlt, setPreviewAlt] = useState(null)
  const [mintedAddress, setMintedAddress] = useState(null)

  const preventClose = [MINT_STAGE.UPLOAD, MINT_STAGE.SIGN, MINT_STAGE.MINTING].includes(stage)

  const usingAltMedia = nftProps.category !== CATEGORIES.IMAGE

  useEffect(() => {
    const { imageFile, altMediaFile } = nftProps

    if (!imageFile) return
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(imageFile);

    if (altMediaFile) {
      const altReader = new FileReader();
      altReader.onloadend = () => {
        setPreviewAlt(altReader.result);
      };
      altReader.readAsDataURL(altMediaFile);
    }
  }, [nftProps])
  
  const resetLocally = () => {
    setMintedAddress(null)
    setPreviewImage(null)
    setPreviewAlt(null)
    setStage(MINT_STAGE.INIT)
  }

  const handleClose = useCallback((overrideClose = false) => {
    if (preventClose && !overrideClose) return
    onClose()
    setTimeout(() => resetLocally(), 500) //wait for modal to close before resetting so the content doesn't change while closing
  }, [onClose, preventClose])

  const handleReset = useCallback(() => {
    onReset()
    onClose()
    setTimeout(() => resetLocally(), 500)
  }, [onClose, onReset])

  const onMint = useCallback(async () => {
    setStage(MINT_STAGE.UPLOAD)

    const {
      imageFile,
      altMediaFile,
      category,
      creators,
      name,
      description,
      royalties,
      maxSupply,
      collection,
      attributes,
      externalUrl,
      isMutable
    } = nftProps

    const sellerFeeBasisPoints = royalties * 100 //convert to basis points

    const fileData = new FormData()
    fileData.append("imageFile", imageFile)

    if (altMediaFile) fileData.append("altMediaFile", altMediaFile)

    fileData.append("nft", JSON.stringify({
      category,
      creators,
      name,
      description,
      seller_fee_basis_points: sellerFeeBasisPoints,
      external_url: externalUrl,
      attributes,
    }))

    try {
      const uploadMetadataRes = await apiNodeClient.post(
        "upload-metadata",
        fileData,
        {timeout: 0}
      ).then(res => res.data)

      if (uploadMetadataRes.error || !uploadMetadataRes.uri) {
        throw new Error(`Error uploading metadata: ${ uploadMetadataRes?.error }`)
      }

      setStage(MINT_STAGE.MINTING)

      const { uri, metadata } = uploadMetadataRes
      const collectionPubkey = collection ? new PublicKey(collection.mint) : null

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))

      const transactionBuilder = await metaplex.nfts().builders().create({ 
        uri,
        name,
        creators,
        sellerFeeBasisPoints: sellerFeeBasisPoints,
        maxSupply: toBigNumber(maxSupply), //default of 0 is a 1/1
        collection: collectionPubkey,
        isMutable,
      });

      const { mintAddress } = transactionBuilder.getContext();

      if (collection) {
        const collectionBuilder = metaplex.nfts().builders().verifyCollection({
          mintAddress,
          collectionMintAddress: collectionPubkey
        })
  
        transactionBuilder.add(collectionBuilder)
      }
      
      const createTx = await makeTxWithPriorityFeeFromMetaplexBuilder(transactionBuilder, wallet.publicKey)

      await signAndConfirmTx({
        tx: createTx,
        errorMessage: "Error confirming Create tx",
        wallet,
      })

      setMintedAddress(mintAddress.toString())
      setStage(MINT_STAGE.SUCCESS)
      shootConfetti(3)

      const {
        animation_url,
        image,
        description,
        properties,
      } = metadata

      const token = {
        mint: mintAddress.toString(),
        owner_address: wallet.publicKey.toString(),
        artist_address: wallet.publicKey.toString(),
        name,
        animation_url,
        image,
        description,
        primary_sale_happened: false,
        is_master_edition: Boolean(maxSupply > 0),
        supply: 0,
        max_supply: maxSupply,
        creators: properties.creators,
        files: properties.files,
        royalties: sellerFeeBasisPoints,
      }
      
      //Don't throw a full error for the user if the item is already minted
      await createMintedIndex(user, token)

    } catch (e) {
      console.error("Error minting NFT: ", e.message);
      setStage(MINT_STAGE.ERROR)
    }
  },[nftProps, wallet, user])

  const content = useMemo(() => {
    const {
      creators,
      name,
      description,
      royalties,
      maxSupply,
      category,
      externalUrl,
      isMutable,
      attributes,
    } = nftProps

    const isOneOfOne = maxSupply === 0

    const categoryDisplay = category === CATEGORIES.VR ? "3D Model" : category

    switch (stage) {
      case MINT_STAGE.INIT: return (
        <div>
          <p className="text-center text-xl font-bold">Does everything look correct?</p>
          <div className="grid gap-3 my-5">
            <div className={clsx(
              "px-4 grid grid-cols-1 gap-6",
              usingAltMedia ? "lg:grid-cols-3" : "",
            )}>
              {usingAltMedia
                ? (
                  <div className="flex flex-col gap-2 h-[50vh] lg:col-span-2 relative">
                    <p className="text-center font-bold text-lg capitalize">{categoryDisplay}</p>
                    <div className="relative h-full">
                      {previewAlt ? <AltMedia mediaUrl={previewAlt} category={category} /> : null}
                    </div>
                  </div>
                )
                : null
              }

              <div className={clsx("flex flex-col gap-2 w-full", usingAltMedia && "h-[25vh]")}>
                {usingAltMedia ? <p className="text-center font-bold text-lg">Thumbnail Image</p> : null}
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  className="w-full h-full object-contain rounded overflow-hidden"
                  src={previewImage} alt=""
                />
              </div> 
            </div>
            <div className="flex flex-col gap-2 px-4">
              <div className="grid sm:grid-cols-2 items-center">
                
                <p className="font-bold text-2xl">{name}</p>
              
              
                {isOneOfOne ? (
                  <p className="font-bold"> 1 of 1</p>
                ) : (
                  <p className="font-bold">Editions: {maxSupply || "Open"}</p>                
                )}
              </div>
              
              <p className="text-sm whitespace-pre-wrap textPalette2">{description}</p>
            
              <div className="grid sm:grid-cols-2">
                <p className="font-bold">{royalties}% Royalties</p>
                <div>
                  {creators.map(creator => (
                    <p className="textPalette2" key={creator.address.toString()}>{creator.share}% - {truncate(creator.address.toString())} </p>
                  ))}
                </div>
              </div>
            
            </div>
          </div>
        </div>
      )
      case MINT_STAGE.SUCCESS: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold">Congrats! {name} has been successfully minted!</p>
          <p className="text-center textPalette2">View it on <a className="underline" href={`https://solscan.io/token/${ mintedAddress }`} target="_blank" rel="noreferrer">Solscan</a></p>
          <p className="text-center textPalette2">Freshly minted art may take a few minutes to load.</p>
        </div>
      )
      case MINT_STAGE.ERROR: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold">Sorry, we could not confirm if your mint was successful.</p>
          
          <p className="text-center textPalette2">Please check your wallet to see if the NFT arrived. If you did not receive your NFT, please try to mint again.</p>
        </div>
      )
      
      default: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold animate-pulse">{stage}</p>
          {stage === MINT_STAGE.MINTING ? (
            <p className="text-center">Sign the transaction to mint your art onchain.</p>
          ): (
              <p className="text-center textPalette2">This may take a few minutes.</p>
          )}
          <p className="text-center textPalette2">Please stay on this page until the mint process has finished.</p>
        </div>
      )
    }
  }, [stage, nftProps, previewImage, mintedAddress, previewAlt, usingAltMedia])

  const secondaryButton = useMemo(() => { 
    switch (stage) {
      case MINT_STAGE.SUCCESS: return (
        <MainButton onClick={handleReset} size="lg" className="w-[11.75rem]">
          Create Another
        </MainButton>
      )
      default: return (
        <MainButton onClick={() => handleClose(true)}  size="lg" className="w-[7.66rem]">
          Cancel
        </MainButton>
      )
    }
  }, [stage, handleClose, handleReset])

  const actionButton = useMemo(() => {
    switch (stage) { 
      case MINT_STAGE.INIT: return (
        <MainButton onClick={onMint} solid size="lg" className="w-[7.66rem]">
          Confirm
        </MainButton>
      )
      case MINT_STAGE.SUCCESS: return (
        <Link href={`/art/${ mintedAddress}`} passHref>
          <MainButton solid size="lg" className="w-[11.75rem]">
            Detail Page
          </MainButton>
        </Link>
      )
      case MINT_STAGE.ERROR: return (
        <MainButton onClick={onMint} solid size="lg" className="w-[7.66rem]">
          Retry
        </MainButton>
      )
      default: return (
        <MainButton solid disabled size="lg" className="w-[7.66rem]">
          <span className="inline-block translate-y-0.5">
            <Oval color="#FFF" secondaryColor="#666" height={17} width={17} strokeWidth={2.5}/>
          </span>
        </MainButton>
      )
    }
  }, [stage, onMint, mintedAddress])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeDisabled={preventClose}
      title={`Minting ${ nftProps.name }`}
      widthClass={usingAltMedia && stage === MINT_STAGE.INIT ? "max-w-screen-xl" : "max-w-screen-sm"}
    >
      <div className="h-full overflow-y-auto mt-4">
        {content}
      </div>
    
      <div className={modalActionDivClass}>
        <div className="justify-self-end">
          {secondaryButton}
        </div>
        <div className="">
          {actionButton}
        </div>
      </div>
    </Modal>
  )

}

export default MintModal