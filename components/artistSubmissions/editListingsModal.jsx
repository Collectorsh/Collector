import { useContext, useEffect, useState } from "react";
import Modal from "../Modal";
import MainButton, { WarningButton } from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { roundToPrecision } from "../../utils/maths";
import { error, success } from "../../utils/toast";
import { Oval } from "react-loader-spinner";
import updateListing, { cancelListing } from "../../data/curationListings/updateListing";
import UserContext from "../../contexts/user";
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse";


const EditListingsModal = ({ isOpen, onClose, handleEditListings, curation }) => {
  const [user] = useContext(UserContext);
  const { handleBuyNowList, handleDelist } = useCurationAuctionHouse(curation)

  const submissions = curation?.submitted_token_listings.filter(listing => user.public_keys.includes(listing.owner_address)) || []

  const onList = async (token, listingPrice) => {
 
    // handle 1/1 list
    const receipt = await handleBuyNowList(token.mint, listingPrice)
  
    if (!receipt) { 
      error(`Error Listing ${ token.name } On Chain`)
      return
    }

    const res = await updateListing({
      curationId: curation.id,
      tokenMint: token.mint,
      buyNowPrice: Number(listingPrice),
      apiKey: user.api_key,
      listingReceipt: receipt
    })

    if (res?.status !== "success") {
      error(`Error Saving Listing For ${ token.name }: ${ res?.message }`)
      return
    }

    success(`${ token.name } has been listed!`)

    const newToken = {
      ...token,
      listed_status: "listed",
      buy_now_price: Number(listingPrice),
    }

    handleEditListings([newToken], curation)
  }

  const onDelist = async (token) => {

    await handleDelist(token.listing_receipt)

    const res = await cancelListing({
      curationId: curation.id,
      tokenMint: token.mint,
      apiKey: user.api_key
    })

    if (res?.status !== "success") {
      error(`Error delisting ${ token.name }: ${ res?.message }`)
      return
    }
    success(`${ token.name } has been delisted`)

    const newToken = {
      ...token,
      listed_status: "unlisted",
      buy_now_price: null,
      listing_receipt: null
    }

    handleEditListings([newToken], curation)
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${ curation?.name.replaceAll("_", " ") } Submission Listings`}
    >
      <div className="mt-4 p-4 overflow-auto grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {submissions?.map((token) => (
          <Submission
            key={token.mint}
            token={token}
            onList={onList}
            onDelist={onDelist}
          />
        ))}
      </div>

      <div className="w-full flex justify-end gap-4 mt-4 relative">
        <MainButton onClick={onClose}>
          Close
        </MainButton>
      </div>
    </Modal>
  )
}

export default EditListingsModal;

const Submission = ({ token, onList, onDelist }) => { 
  const [listing, setListing] = useState(false)
  const [listingPrice, setListingPrice] = useState(token.buy_now_price || "")
  const disableListing = !listingPrice || listingPrice <= 0 || listingPrice == token.buy_now_price || listing

  const price = roundToPrecision(token.buy_now_price, 3)

  const isListed = token.listed_status === "listed"
  const isEdition = token.is_edition
  const editionSupply = token.supply

  const handleList = async () => {
    setListing(true)
    await onList(token, Number(listingPrice))
    setListing(false)
  }
  const handleUnlist = async () => { 
    setListing(true)
    await onDelist(token)
    setListing(false)
  }

  return (
    <div className="relative h-fit shadow-md shadow-black/10 dark:shadow-white/5 rounded-lg
      bg-neutral-100 dark:bg-neutral-900
    ">
      <CloudinaryImage
        className={clsx("flex-shrink-0 overflow-hidden object-cover",
          "w-full h-[250px] rounded-t-lg p-1",
        )}
        // id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
        // mint={token.mint}
        token={token}
        width={800}
        useMetadataFallback
        useUploadFallback
      />
      <div className="p-2">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-2 ">
          <h3 className="font-bold text-xl px-1">{token.name}</h3>
        </div>
        {isListed
          ? (
            <div className="flex justify-between  items-center flex-wrap">
              <p className="font-bold px-1">Listed For: {price}◎</p>
              <WarningButton
                onClick={handleUnlist}
                noPadding
                className={clsx("px-3 w-24")}
                disabled={listing}
              >
                Delist
              </WarningButton>
            </div>
          )
          : (
            <div className="flex gap-3 w-full">

              <div className="flex w-full items-center border-2 px-3 py-0 rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <input
                  type="number"
                  className="outline-none bg-transparent w-full"
                  placeholder="Buy Now Price"
                  onChange={(e) => setListingPrice(e.target.value)}
                  value={listingPrice}
                />
                <p>◎</p>
              </div>
              <MainButton
                solid
                onClick={handleList}
                disabled={disableListing}
                noPadding
                className={clsx("px-3 w-24 flex-shrink-0")}
              >
                {listing
                  ? (
                    <span className="inline-block translate-y-0.5">
                      <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                    </span>
                  )
                  : "List!"
                }
              </MainButton>

            </div>
          )
        }
      </div>
    </div>
  )
}