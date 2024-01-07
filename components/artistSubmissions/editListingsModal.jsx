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
import { Metaplex, PublicKey, token, walletAdapterIdentity } from "@metaplex-foundation/js";
import { XCircleIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import deleteSubmission from "../../data/curationListings/deleteSubmission";
import retryFetches from "../../utils/curations/retryFetches";
import { Market } from "@metaplex-foundation/mpl-fixed-price-sale";
import { useRouter } from "next/router";
import LogRocket from "logrocket";
import getListedItem from "../../data/curationListings/getListedItem";
import LogRocketContext from "../../contexts/logRocket";

const EditListingsModal = ({ isOpen, onClose, handleEditListings, handleRemoveListing, curation }) => {
  const [user] = useContext(UserContext);
  const wallet = useWallet()
  const router = useRouter()

  const { setAlwaysRecord } = useContext(LogRocketContext)

  const { handleBuyNowList, handleDelist, auctionHouse } = useCurationAuctionHouse(curation)
  
  const submissions = curation?.submitted_token_listings.filter(listing => {
    const owned = listing.owner_address === wallet.publicKey.toString()
    const closedMaster = listing.is_master_edition && listing.listed_status === "master-edition-closed"
    return owned && !closedMaster
  }) || [];

  const isPersonalCuration = curation?.curation_type !== "curator" //"artist" || "collector"

  useEffect(() => { 
    setAlwaysRecord(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onList = async (token, listingPrice) => {
    let newToken

    if (!user.api_key) {
      error("Error connecting. Please refresh and reconnect your wallet to finish listing")
      return
    }

    if (token.is_master_edition) {

      const listingRes = await getListedItem(token.mint)

      if (listingRes.status === "success") {
        const curationName = listingRes.curationName.replaceAll("_", " ")
        error(`${ token.name } is already listed in ${ curationName}`)
        return
      }
      
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

      if (router.query.simulate) {
        const signed = await wallet.signTransaction(listMasterEditionTX)
        const sim = await connection.simulateTransaction(signed)
        console.log("🚀 ~ file: editListingsModal.jsx:65 ~ onList ~ sim:", sim)

        return;
      }

      const signedTx = await wallet.signTransaction(listMasterEditionTX)
 
      const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))

      //const { signature, confirmResponse } = 
      await metaplex.rpc().sendAndConfirmTransaction(
        signedTx,
        { commitment: "finalized" }
      )
      // if (!signature || Boolean(confirmResponse.value.err)) {
      //   error(`Error Listing ${ token.name } Editions Onchain`)
      //   return
      // }

      //using onchain marketdata as a confirmation strategy because the rpc confirmation response was unreliable
      const marketData = await retryFetches(async () => {
        const marketPubkey = new PublicKey(editionMarketAddress)
        const marketAccount = await connection.getAccountInfo(marketPubkey);
        const [marketData] = Market.deserialize(marketAccount?.data);
        return marketData
      })

      if (!marketData) {
        throw new Error("Error confirming onchain listing")
      }

      const res = await updateListing({
        curationId: curation.id,
        tokenMint: token.mint,
        buyNowPrice: Number(listingPrice),
        apiKey: user.api_key,
        editionMarketAddress
      })

      if (res?.status !== "success") {
        error(`Error Saving Listing For ${ token.name }`)
        throw new Error(`Error saving listing for ${ token.name } : ${ res?.message }`)
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
    let newToken;
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

      if (router.query.simulate) {
        const signed = await wallet.signTransaction(closeAndWithdrawMarketTX)
        const sim = await connection.simulateTransaction(signed)
        console.log("🚀 ~ file: editListingsModal.jsx:168 ~ onDelist ~ sim:", sim)

        return;
      }

      // const signed = await wallet.signTransaction(closeAndWithdrawMarketTX)
      // const delistTXSignature = await connection.sendRawTransaction(signed.serialize({
      //   // requireAllSignatures: false,
      //   // verifySignatures: false,
      // }))

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

      const status = token.supply >= token.max_supply ? "master-edition-closed" : "unlisted"

      newToken = {
        ...token,
        listed_status: status,
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

  const onDelete = async (token) => {
    if (token.listed_status === "listed" || isPersonalCuration) return //personal curations need to delete from the art module
    
    const res = await deleteSubmission({
      curationId: curation.id,
      tokenMint: token.mint,
      apiKey: user.api_key,
    })

    if (res.status === "success") {
      success(`${ token.name } has been removed!`)
      handleRemoveListing(token, curation)
    } else {
      error(`Error Removing ${ token.name }`)
    } 
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${ curation?.name.replaceAll("_", " ") } Submission Listings`}
    >
      <div className="overflow-auto ">
        <div className="text-center mt-4">
          <p className="font-bold">Please be aware: </p>
          <p className={curation?.curation_type !== "curator" && "hidden" }>
            &bull; Your curator {curation?.curator.username} will receive {curation?.curator_fee}% of the sale price
          </p>
          <p>
            &bull; For listings to be valid on Collector, your artwork cannot be listed on custodial marketplaces like Exchange Art or Mallow
          </p>
          <p className={curation?.curation_type === "collector" && "hidden"}>
            &bull; To receive funds from primary edition sales you will need to close the sale. This will also return the master edition to your wallet.
          </p>

        </div>

        <div className="mt-4 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {submissions?.map((token) => (
            <Submission
              key={token.mint}
              token={token}
              onList={onList}
              onDelist={onDelist}
              onDelete={onDelete}
              isPersonalCuration={isPersonalCuration}
            />
          ))}
        </div>

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

const Submission = ({ token, onList, onDelist, onDelete, isPersonalCuration }) => { 
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
      console.log("Handle List error: ", err)
      LogRocket.captureException(err, {
        extra: {
          tokenMint: token.mint,
          listingPrice,
        }
      })
    }
    setListing(false)
  }

  const handleUnlist = async () => { 
    try {
      setListing(true)
      await onDelist(token)
    } catch (err) {
      console.log("handleDelist error: ", err)
      LogRocket.captureException(err, {
        extra: {
          tokenMint: token.mint,
        }
      })
    }
    setListing(false)
  }

  const handleDelete = async () => {
    try {
      setListing(true)
      await onDelete(token)
    } catch (err) {
      console.log("handleDelete error: ", err)
    }
    setListing(false)
  }

  const delistText = isMasterEdition
    ? (isSoldOut ? "Withdraw" : "End Sale")
    : "Delist"

  return (
    <div className="relative h-fit shadow-md shadow-black/10 dark:shadow-white/5 rounded-lg
      bg-neutral-100 dark:bg-neutral-700
    ">
      <Tippy
        className="shadow-lg"
        content={token.listed_status !== "unlisted"
          ? "You must close the listing before removing the submission"
          : "This will remove your submission from the curation"
        }
      >
        <div>
          <button
            className={clsx(
              "absolute -top-2 -right-2",
              "bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full shadow-lg dark:shadow-white/10",
              "duration-300 hover:scale-110 active:scale-100 disabled:hover:scale-100",
              isPersonalCuration && "hidden"
            )}
            onClick={handleDelete}
            disabled={token.listed_status !== "unlisted"}
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </Tippy>

      <CloudinaryImage
        className={clsx("flex-shrink-0 overflow-hidden object-cover",
          "w-full h-[250px] rounded-t-lg p-1",
        )}
        token={token}
        width={500}
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