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
import { useWallet } from "@solana/wallet-adapter-react";
import { getListMasterEditionTX } from "../../utils/curations/listMasterEdition";
import { connection } from "../../config/settings";
import { getCloseAndWithdrawMarketTX } from "../../utils/curations/closeAndWithdrawMasterEdition";


const EditListingsModal = ({ isOpen, onClose, handleEditListings, curation }) => {
  const [user] = useContext(UserContext);
  const wallet = useWallet()

  const { handleBuyNowList, handleDelist, auctionHouse } = useCurationAuctionHouse(curation)

  const submissions = curation?.submitted_token_listings.filter(listing => {
    const owned = user?.public_keys.includes(listing.owner_address)
    const closedMaster = listing.is_master_edition && listing.listed_status === "master-edition-closed"
    return owned && !closedMaster
  }) || []

  const onList = async (token, listingPrice) => {
    let newToken

    if (token.is_master_edition) {
      //Handle master edition market creation and update to the curation_listing
      const builder = await getListMasterEditionTX({
        connection: connection,
        masterEdition: token,
        editionPrice: Number(listingPrice),
        ownerPubkey: wallet.publicKey,
        // piecesPerWallet:
      })
      if (!builder) {
        error(`Error Building ${ token.name } Editions Transaction`)
        return
      }

      const {
        listMasterEditionTX,
        editionMarketAddress
      } = builder

      const signature = await wallet.sendTransaction(listMasterEditionTX, connection)
      const confirmation = await connection.confirmTransaction(signature);

      if (!signature || Boolean(confirmation.value.err)) {
        error(`Error Listing ${ token.name } Editions Onchain`)
        return
      }

      const res = await updateListing({
        curationId: curation.id,
        tokenMint: token.mint,
        buyNowPrice: Number(listingPrice),
        apiKey: user.api_key,
        editionMarketAddress
      })

      if (res?.status !== "success") {
        error(`Error Saving Listing For ${ token.name }: ${ res?.message }`)
        return
      }

      success(`${ token.name } has been listed!`)

      newToken = {
        ...token,
        master_edition_market_address: editionMarketAddress,
        listed_status: "listed",
        buy_now_price: Number(listingPrice),
      }
    } else if (token.is_edition) {

      //TODO handle edition list

      return
    } else {
      //Handle 1/1 list
      const receipt = await handleBuyNowList(token.mint, listingPrice)
      if (!receipt) {
        error(`Error Listing ${ token.name } Onchain`)
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

      newToken = {
        ...token,
        listed_status: "listed",
        buy_now_price: Number(listingPrice),
      }
    }

    if(newToken) handleEditListings(newToken, curation)
  }

  const onDelist = async (token) => {

    let newToken
    if (token.is_master_edition) {
      //Handle master edition market close, treasury withdraw & asset retrieval
      const builder = await getCloseAndWithdrawMarketTX({
        connection: connection,
        ownerPubkey: wallet.publicKey,
        masterEditionMint: token.mint,
        marketAddress: token.master_edition_market_address,
        feePoints: auctionHouse.sellerFeeBasisPoints,
        curationTreasuryAddress: auctionHouse.treasuryAccountAddress.toString()
      })

      if (!builder) {
        error(`Error Building ${ token.name } Claim Transaction`)
        return
      }

      const { closeAndWithdrawMarketTX } = builder

      const delistTXSignature = await wallet.sendTransaction(closeAndWithdrawMarketTX, connection)
      const confirmation = await connection.confirmTransaction(delistTXSignature);

      if (!delistTXSignature || Boolean(confirmation.value.err)) {
        error(`Error Delisting ${ token.name } Onchain`)
        return
      }

      const res = await cancelListing({
        curationId: curation.id,
        tokenMint: token.mint,
        apiKey: user.api_key
      })

      if (res?.status !== "success") {
        error(`Error Withdrawing ${ token.name }: ${ res?.message }`)
        return
      }
      success(`${ token.name } Has Been Withdrawn!`)

      newToken = {
        ...token,
        listed_status: "master-edition-closed",
        buy_now_price: null,
        primary_sale_happened: true
      }
    } else if (token.is_edition) {

      //TODO Handle edition delist

      return
    } else {
      //Handle 1/1 delist
      const delistTXSignatureConfirmation = await handleDelist(token.listing_receipt)

      if (!delistTXSignatureConfirmation) {
        error(`Error Delisting ${ token.name } Onchain`)
        return
      }

      const res = await cancelListing({
        curationId: curation.id,
        tokenMint: token.mint,
        apiKey: user.api_key
      })

      if (res?.status !== "success") {
        error(`Error delisting ${ token.name }: ${ res?.message }`)
        return
      }
      success(`${ token.name } Has Been Delisted`)

      newToken = {
        ...token,
        listed_status: "unlisted",
        buy_now_price: null,
        listing_receipt: null
      }
    }
    if (newToken) handleEditListings(newToken, curation)
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
  
  const price = roundToPrecision(token.buy_now_price, 3)
  
  const isMasterEdition = token.is_master_edition
  const editionSupply = token.supply
  const editionMaxSupply = token.max_supply
  const editionsLeft = editionMaxSupply - editionSupply
  const isSoldOut = isMasterEdition ? editionsLeft <= 0 : false
  const isListed = token.listed_status === "listed" || (isMasterEdition && isSoldOut)//to allow owner to withdraw master edition
  const isClosed = token.listed_status === "master-edition-closed"
  const disableListing = !listingPrice || listingPrice <= 0 || listingPrice == token.buy_now_price || listing || isSoldOut

  const handleList = async () => {
    try {
      setListing(true)
      await onList(token, listingPrice)
    } catch (err) {
      console.log("handleList error: ", err)
    }
    setListing(false)
  }
  const handleUnlist = async () => { 
    try {
      setListing(true)
      await onDelist(token)
    } catch (err) {
      console.log("handleDelist error: ", err)
    }
    setListing(false)
  }

  const delistText = isMasterEdition
    ? isSoldOut ? "Withdraw" : "End Sale"
    : "Delist"

  return (
    <div className="relative h-fit shadow-md shadow-black/10 dark:shadow-white/5 rounded-lg
      bg-neutral-100 dark:bg-neutral-700
    ">
      <CloudinaryImage
        className={clsx("flex-shrink-0 overflow-hidden object-cover",
          "w-full h-[250px] rounded-t-lg p-1",
        )}
        token={token}
        width={800}
        useMetadataFallback
        useUploadFallback
      />
      <div className="p-2">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-2 ">
          <h3 className="font-bold text-xl px-1">{token.name}</h3>
          <p className="text-sm">{isMasterEdition ? `(${ editionsLeft }/${editionMaxSupply} Editions)` : ""}</p>
        </div>
        {isListed
          ? (
            <div className={clsx("flex items-center flex-wrap", isClosed ? "justify-center": "justify-between")}>
              <p className="font-bold px-1 py-1">
                {isSoldOut
                  ? "Sold Out!"
                  : `Listed For: ${price}◎`
                }
              </p>
              <WarningButton
                onClick={handleUnlist}
                noPadding
                className={clsx("px-3 w-28", isClosed && "hidden")}
                disabled={listing || isClosed}
              >
                {listing
                  ? (
                    <span className="inline-block translate-y-0.5">
                      <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                    </span>
                  )
                  : delistText
                }
              </WarningButton>
            </div>
          )
          : (
            <div className="flex gap-3 w-full">

              <div className="flex w-full items-center border-2 px-3 py-0 rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <input
                  type="number"
                  min={0}
                  className="outline-none bg-transparent w-full"
                  placeholder={isMasterEdition ? "Edition Price" : "Buy Now Price"}
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