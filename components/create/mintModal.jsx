import { useCallback, useEffect, useMemo, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { apiNodeClient } from "../../data/client/apiClient"
import { Metaplex, toBigNumber, walletAdapterIdentity } from "@metaplex-foundation/js"
import { connection } from "../../config/settings"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { Oval } from "react-loader-spinner"
import { truncate } from "../../utils/truncate"
import { shootConfetti } from "../../utils/confetti"

const MINT_STAGE = {
  INIT: "Init",
  UPLOAD: "Uploading...",
  MINTING: "Minting...",
  SUCCESS: "Success",
  ERROR: "Error"
}

const MintModal = ({ nftProps, isOpen, onClose, onReset }) => {
  const wallet = useWallet();
  const [stage, setStage] = useState(MINT_STAGE.INIT)
  const [previewImage, setPreviewImage] = useState(null)
  const [mintedAddress, setMintedAddress] = useState(null)

  const preventClose = [MINT_STAGE.UPLOAD, MINT_STAGE.SIGN, MINT_STAGE.MINTING].includes(stage)

  useEffect(() => {
    const { imageFile } = nftProps
    if (!imageFile) return
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(imageFile);
  }, [nftProps])
  
  const resetLocally = () => {
    setMintedAddress(null)
    setPreviewImage(null)
    setStage(MINT_STAGE.INIT)
  }

  const handleClose = useCallback(() => {
    if (preventClose) return
    onClose()
    resetLocally()
  }, [onClose, preventClose])

  const handleReset = useCallback(() => {
    onReset()
    onClose()
    resetLocally()
  }, [onClose, onReset])

  const onMint = useCallback(async () => {
    setStage(MINT_STAGE.UPLOAD)
    const {
      imageFile,
      category,
      creators,
      name,
      description,
      royalties,
      maxSupply,
      attributes,
      external_url
    } = nftProps

    const sellerFeeBasisPoints = royalties * 100 //convert to basis points

    const fileData = new FormData()
    fileData.append("imageFile", imageFile)
    fileData.append("nft", JSON.stringify({
      category,
      creators,
      name,
      description,
      seller_fee_basis_points: sellerFeeBasisPoints,
      // attributes: attributes,
      // external_url: "collector.sh"
    }))

    try {
      const res = await apiNodeClient.post("upload-metadata", fileData).then(res => res.data)

      if (res.error || !res.uri) {
        throw new Error(`Error uploading metadata: ${ res?.error }`)
      }

      setStage(MINT_STAGE.MINTING)

      const uri = res.uri

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))

      const newNft = await metaplex
        .nfts()
        .create({
          uri,
          name,
          creators,
          sellerFeeBasisPoints: sellerFeeBasisPoints,
          maxSupply: toBigNumber(maxSupply), //default of 0 is a 1/1
        }).then(res => res.nft)

      shootConfetti(3)
      setMintedAddress(newNft.address.toString())
      setStage(MINT_STAGE.SUCCESS)
    } catch (e) {
      console.error("Error minting NFT: ", e);
      setStage(MINT_STAGE.ERROR)
    }
  },[nftProps, wallet])

  const content = useMemo(() => {
    const {
      creators,
      name,
      description,
      royalties,
      maxSupply,
      attributes,
      external_url
    } = nftProps

    const isOneOfOne = maxSupply === 0

    switch (stage) {
      case MINT_STAGE.INIT: return (
        <div>
          <p className="text-center text-xl font-bold">Does everything look correct?</p>
          <div className="grid gap-3 my-5">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              className="w-full h-full object-contain rounded"
              src={previewImage} alt=""
            />
            <div className="flex flex-col gap-2 px-4">
              <div className="grid sm:grid-cols-2 items-center">
                
                <p className="font-bold text-2xl">{name}</p>
              
              
                {isOneOfOne ? (
                  <p className="font-bold"> 1 of 1</p>
                ) : (
                  <p className="font-bold">Editions: {maxSupply}</p>                
                )}
              </div>
              
              <p className="text-sm whitespace-pre-wrap">{description}</p>
            
              <div className="grid sm:grid-cols-2">
                <p className="font-bold">{royalties}% Royalties</p>
                <div>
                  {creators.map(creator => (
                    <p className="" key={creator.address.toString()}>{creator.share}% - {truncate(creator.address.toString())} </p>
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
          <p className="text-center">View it on <a className="underline" href={`https://solscan.io/token/${ mintedAddress }`}>Solscan</a></p>
        </div>
      )
      case MINT_STAGE.ERROR: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold">Sorry, there was an error minting your art onchain.</p>
          <p className="text-center">Please, make sure your internet connection is stable and then try again.</p>
        </div>
      )
      
      default: return (
        <div className="h-56 flex flex-col gap-2 justify-center">
          <p className="text-center text-2xl font-bold animate-pulse">{stage}</p>
          {MINT_STAGE.MINTING ? (
            <p className="text-center">Sign the transaction to mint your art onchain.</p>
          ): (
            <p className="text-center">This may take a few minutes.</p>
          )}
          <p className="text-center">Please stay on this page until the mint process has finished.</p>
        </div>
      )
    }
  }, [stage, nftProps, previewImage, mintedAddress])

  const secondaryButton = useMemo(() => { 
    switch (stage) {
      case MINT_STAGE.SUCCESS: return (
        <MainButton onClick={handleReset}>
          Create Another
        </MainButton>
      )
      default: return (
        <MainButton onClick={handleClose} disabled={preventClose}>
          Close
        </MainButton>
      )
    }
  }, [stage, preventClose, handleClose, handleReset])

  const actionButton = useMemo(() => {
    switch (stage) { 
      case MINT_STAGE.INIT: return (
        <MainButton onClick={onMint} solid>
          Confirm
        </MainButton>
      )
      {/* TODO if artist with curations show profile page button instead */}
      case MINT_STAGE.SUCCESS: return (
        <Link href="/submissions" passHref>
          <MainButton solid>
            Submissions
          </MainButton>
        </Link>
      )
      case MINT_STAGE.ERROR: return (
        <MainButton onClick={onMint} solid>
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
  }, [stage, onMint])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeDisabled={preventClose}
      title={`Minting ${ nftProps.name }`}
      widthClass="max-w-screen-sm"
    >
      <div className="h-full overflow-y-auto my-2">
        {content}
      </div>
    
      <div className="w-full grid grid-cols-2 gap-4">
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