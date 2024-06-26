import { useContext, useEffect, useMemo, useState } from "react";
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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import deleteSubmission from "../../data/curationListings/deleteSubmission";

import { setTxFailed } from "../../utils/cookies";
import * as Icon from "react-feather";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { truncate } from "../../utils/truncate";
import { displayName } from "../../utils/displayName";

const EditListingsModal = ({ isOpen, onClose, handleEditListings, handleRemoveListing, curation }) => {
  const [user] = useContext(UserContext);
  const wallet = useWallet()
  const { setVisible: setModalVisible } = useWalletModal();
  const { handleBuyNowList, handleDelist, handleMasterEditionCloseAndWithdraw, handleMasterEditionList } = useCurationAuctionHouse(curation)
  
  const submissions = (() => {
    const baseListings = curation?.submitted_token_listings.filter(listing => {
      const owned = listing.owner_address === wallet?.publicKey?.toString()
      // const owned = user.public_keys.includes(listing.owner_address)
      const closedMaster = listing.is_master_edition && listing.listed_status === "master-edition-closed"
      return owned && !closedMaster
    }) || [];

    baseListings.sort((a, b) => {
      const nameComp = a.name.localeCompare(b.name)
      // if (a.listed_status === "listed") return -1 
      // if (b.listed_status === "listed") return 1 
      return nameComp
    })
    return baseListings
  })();

  const isPersonalCuration = curation?.curation_type !== "curator" //"artist" || "collector"

  const onList = async (token, listingPrice) => {
    let newToken

    if (!user.api_key) {
      error("Error connecting. Please refresh and reconnect your wallet to finish listing")
      return
    }

    if (token.is_master_edition) {
      const listMasterEdRes = await handleMasterEditionList(token, listingPrice)

      if (listMasterEdRes.error) {
        error(`Error Listing Master Edition ${ token.name } Onchain`)
        return
      } else if (listMasterEdRes.editionMarketAddress) {
        const editionMarketAddress = listMasterEdRes.editionMarketAddress

        const res = await updateListing({
          curationId: curation.id,
          tokenMint: token.mint,
          buyNowPrice: Number(listingPrice),
          apiKey: user.api_key,
          editionMarketAddress
        })

        if (res?.status !== "success") {
          // set tx as failed, this will trigger a search for the existing market address in "handleMasterEditionList" the next time its tried
          setTxFailed(listMasterEdRes.listMasterEditionTxCookieId, true)

          console.log(`Error Saving Master Edition Listing For ${ token.name }: ${ res?.message }`)
          error(`Error Saving Master Edition Listing For ${ token.name }`)
          return
        }

        success(`${ token.name } has been listed!`)

        newToken = {
          ...token,
          master_edition_market_address: editionMarketAddress,
          listed_status: "listed",
          buy_now_price: Number(listingPrice),
        }
      }
    } else {
      //Handle 1/1 and secondary edition list
      const listRes = await handleBuyNowList(token.mint, listingPrice)

      if (listRes.error) {
        error(`Error Listing ${ token.name } Onchain`)
        return
      } else if (listRes.receipt) {

        const res = await updateListing({
          curationId: curation.id,
          tokenMint: token.mint,
          buyNowPrice: Number(listingPrice),
          apiKey: user.api_key,
          listingReceipt: listRes.receipt
        })

        if (res?.status !== "success") {
          // set tx as failed, this will trigger a search for the existing receipt in "handleBuyNowList" the next time its tried
          setTxFailed(listRes.listTxCookieId, true)

          console.log(`Error Saving Listing For ${token.name}: ${res?.message}`)
          error(`Error Saving Listing For ${ token.name }`)
          return
        }

        success(`${ token.name } has been listed!`)

        newToken = {
          ...token,
          listed_status: "listed",
          buy_now_price: Number(listingPrice),
        }
      }      
    }

    if(newToken) handleEditListings(newToken, curation)
  }

  const onDelist = async (token) => {
    let newToken;
    if (token.is_master_edition) {
      //Handle master edition market close, treasury withdraw & asset retrieval
     
      const withdrawRes = await handleMasterEditionCloseAndWithdraw(token)

      if (withdrawRes.error) {
        error(`Error Withdrawing ${ token.name } Onchain`)
        return
      } else if (withdrawRes.signature) { 

        
        const res = await cancelListing({
          curationId: curation.id,
          tokenMint: token.mint,
          apiKey: user.api_key
        })

        if (res?.status !== "success") {
          setTxFailed(withdrawRes.withdrawCookieId, true)

          console.log(`Error saving withdraw of ${ token.name }: ${ res?.message }`)
          error(`Error saving withdraw of ${ token.name }`)
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
      }
    } else {
      //Handle 1/1 and secondary edition delist
      const delistRes = await handleDelist(token)

      if (delistRes.error) {
        error(`Error Delisting ${ token.name } Onchain`)
        return
      } else if (delistRes.signature) {
    
        const res = await cancelListing({
          curationId: curation.id,
          tokenMint: token.mint,
          apiKey: user.api_key
        })

        if (res?.status !== "success") {
          // set tx as failed, this will trigger a search for the existing listings in "handleDelist" the next time its tried
          setTxFailed(delistRes.delistCookieId, true)

          console.log(`Error saving delist of ${ token.name }: ${ res?.message }`)
          error(`Error saving delist of ${ token.name }`)
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

  const useCuratorInfo = curation?.curation_type === "curator"
  const useMasterEditionInfo = curation?.curation_type !== "collector"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit "${ curation?.name.replaceAll("_", " ") }" Listings`}
    >

      <p className="text-sm textPalette2 text-center">Viewing listings from {truncate(wallet?.publicKey?.toBase58(), 4)}</p>      

      <div className="overflow-auto">
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
          {!submissions.length ? (
            <div className="col-span-3 flex flex-col gap-1 items-center justify-center h-full w-full pb-12 bt-6">
              <p className="font-bold">No Listings Yet</p>
              <p>Add your artwork via the art module and then list them here.</p>
            </div>
          ): null}
        </div>
      </div>
      <div className={clsx("text-left mt-4 text-xs", (!useCuratorInfo && !useMasterEditionInfo) ? "hidden" : "")}>
        <p className="font-bold text-left">Please be aware: </p>
        <p className={!useCuratorInfo ? "hidden" : "text-neutral-500"}>
          Your curator {displayName(curation?.curator)} will receive {curation?.curator_fee}% of the sale price.
        </p>
        <p className={!useMasterEditionInfo ? "hidden" : "text-neutral-500"}>
          To receive funds from primary edition sales you will need to close the sale. This will also return the master edition to your wallet.
        </p>

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
  const isEdition = token.is_edition
  const editionSupply = token.supply
  const editionMaxSupply = token.max_supply
  const editionsLeft = editionMaxSupply - editionSupply
  const isSoldOut = isMasterEdition ? editionsLeft <= 0 : false
  const isListed = token.listed_status === "listed" || (isMasterEdition && isSoldOut)//to allow owner to withdraw master edition
  const isClosed = token.listed_status === "master-edition-closed"
  const disableListing = !listingPrice || listingPrice <= 0 || listing || isSoldOut || token.compressed //listingPrice == token.buy_now_price 

  const handleList = async () => {
    try {
      setListing(true)
      await onList(token, listingPrice)
    } catch (err) {
      console.log("Handle List error: ", err)
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

  const handleDelete = async () => {
    try {
      setListing(true)
      await onDelete(token)
    } catch (err) {
      console.log("handleDelete error: ", err)
    }
    setListing(false)
  }

  const infoBadge = useMemo(() => {
    if (token.compressed) return (
      <Tippy
        className="shadow-lg"
        content="Compressed - We currently do not support listings for compressed nfts"
      >
        <span>C</span>
      </Tippy>
    )
    if (token.is_edition) return (
      <Tippy
        className="shadow-lg"
        content="Editions (secondary) - If there are multiple edition listings, the lowest price will be sold first"
      >
        <span>E</span>
      </Tippy>
    )
    if (token.is_master_edition) return (
      <Tippy
        className="shadow-lg"
        content="Master Editions - To receive funds from primary edition sales you will need to close the sale. This will also return the master edition to your wallet."
      >
        <span>M</span>
      </Tippy>
    )
    return null
    // return token.editions?.length
  }, [token])

  const delistText = isMasterEdition
    ? (isSoldOut ? "Withdraw" : "End Sale")
    : "Delist"

  return (
    <div className="relative h-fit shadow-md rounded-lg
      bg-neutral-200 dark:bg-neutral-700
    ">
      <Tippy
        className="shadow"
        content={token.listed_status !== "unlisted"
          ? "You must close the listing before removing the submission"
          : "This will remove your submission from the curation"
        }
      >
        {/* extra div to allow disabled button and tippy at same time */}
        <div className="absolute -top-2 -right-2">
          <button
            className={clsx(
               "p-1",
              "bg-neutral-300/50 dark:bg-neutral-900/50 rounded-full shadow-md",
              "duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-900",
              isPersonalCuration && "hidden"
            )}
            onClick={handleDelete}
            disabled={token.listed_status !== "unlisted"}
          >
            <Icon.X />
          </button>
        </div>
      </Tippy>

      <div className={clsx(
        !infoBadge && "hidden",
        "palette1 ",
        "rounded-full ring-2 ring-neutral-300 dark:ring-neutral-700",
        "min-w-fit w-6 h-6 absolute top-2 left-2 z-10 flex justify-center items-center",
        "text-leading-none font-bold"
      )}>
        {infoBadge}
      </div>

      <CloudinaryImage
        className={clsx("flex-shrink-0 overflow-hidden object-contain",
          "w-full h-[250px] rounded-t-lg p-1",
        )}
        token={token}
        width={500}
        useMetadataFallback
        useUploadFallback
      />
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center gap-x-3 mb-2">
          <p className="font-bold text-xl px-1">{token.name}</p>
          <p className="text-sm">{isMasterEdition ? `(${ editionsLeft }/${editionMaxSupply} Editions)` : ""}</p>
        </div>
        {isListed
          ? (
            <div className={clsx("flex items-center flex-wrap", isClosed ? "justify-center": "justify-between")}>
              <p className="font-bold px-1 py-1 textPalette2">
                {isSoldOut
                  ? "Sold Out!"
                  : `Listed For ${price}◎`
                }
              </p>
              <MainButton
                onClick={handleUnlist}
                
                className={clsx("w-28 flex justify-center items-center", isClosed && "hidden")}
                disabled={listing || isClosed}
              >
                {listing
                  ? <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} className="translate-y-0.5" />
                  : delistText
                }
              </MainButton>
            </div>
          )
          : (
            <div className="flex gap-3 w-full">
              <div className="flex w-full items-center border-2 px-3 py-0 rounded-lg border-neutral-400 dark:border-neutral-600 bg-neutral-300 dark:bg-neutral-800">
                <input
                  type="number"
                  min={0}
                  className="outline-none bg-transparent w-full"
                  placeholder={(isMasterEdition || isEdition) ? "Edition Price" : "Buy Now Price"}
                  onChange={(e) => setListingPrice(e.target.value)}
                  value={listingPrice}
                />
                <p>◎</p>
              </div>

              <Tippy
                className="shadow-lg"
                content="We currently do not support listings for compressed nfts"
                disabled={!token.compressed}
              >
                <div>
                  <MainButton
                    solid
                    onClick={handleList}
                    disabled={disableListing}
                   
                    className={clsx("w-24 flex-shrink-0 flex items-center justify-center")}
                  >
                    {listing
                      ? <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} className="translate-y-0.5" />
                      : "List!"
                    }
                  </MainButton>

                </div>
              </Tippy>

            </div>
          )
        }
      </div>
    </div>
  )
}