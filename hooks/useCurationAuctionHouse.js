import { Metaplex, sol, walletAdapterIdentity, AuctionHouse, token } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionMessage, VersionedTransaction, ba, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { connection } from "../config/settings";
import { getSplitBalance } from "../pages/api/curations/withdraw";
import UserContext from "../contexts/user";
import { getMintEditionTX } from "../utils/curations/mintEdition";
import recordSale from "../data/salesHistory/recordSale";
import { error, success } from "../utils/toast";
import { shootConfetti } from "../utils/confetti";
import { findATA, findTokenAccountsByOwner } from "../utils/curations/findTokenAccountsByOwner";
import { getTransferNftTX } from "../utils/curations/transferNft";
import { getMasterEditionMarketAddress, getTxFailed, setMasterEditionMarketAddress, setTxFailed } from "../utils/cookies";
import { getPriorityFeeInstruction, makeTxWithPriorityFeeFromMetaplexBuilder } from "../utils/solanaWeb3/priorityFees";
import { signAndConfirmTx } from "../utils/solanaWeb3/signAndConfirm";
import { getCloseAndWithdrawMarketTX } from "../utils/curations/closeAndWithdrawMasterEdition";
import { getNftOwner } from "../utils/solanaWeb3/getNftOwner";
import getListedItem from "../data/curationListings/getListedItem";
import { getListMasterEditionTX } from "../utils/curations/listMasterEdition";
import { Market } from "@metaplex-foundation/mpl-fixed-price-sale";
import { updateEditionListing } from "../data/curationListings/updateEditionSupply";
import { updateListingStatus } from "../data/curationListings/updateListing";
import { LOOKUP_TABLE_ADDRESSES, getVersionedTxWithLookupTable } from "../utils/solanaWeb3/addressLookupTables";
import { getMasterEditionSupply } from "../utils/solanaWeb3/getMasterEditionSupply";
const DEBUG = false

const userRejectedText = "rejected"

const useCurationAuctionHouse = (curation) => {
  const wallet = useWallet();
  const [user] = useContext(UserContext);
  const [auctionHouse, setAuctionHouse] = useState(null);
  const [collectedFees, setCollectedFees] = useState({
    curatorBalance: 0,
    platformBalance: 0
  });

  const auctionHouseAddress = curation?.auction_house_address

  const metaplex = new Metaplex(connection)
    .use(walletAdapterIdentity(wallet))
    
  const auctionHouseSDK = metaplex.auctionHouse()

  //set auction house
  useEffect(() => {
    if (!wallet.connected || !auctionHouseAddress || auctionHouse) return
  
    (async () => {
      const auctionHouse = await auctionHouseSDK
        .findByAddress({ address: new PublicKey(auctionHouseAddress) });
      setAuctionHouse(auctionHouse)
      DEBUG && console.log("auctionHouseAddress:", auctionHouseAddress)
      DEBUG && console.log("feeAccountAddress:", auctionHouse.feeAccountAddress.toString())
      DEBUG && console.log("treasuryAddress:", auctionHouse.treasuryAccountAddress.toString())
      DEBUG && console.log("fee Points:", auctionHouse.sellerFeeBasisPoints)
    })()
  }, [wallet.connected, auctionHouseAddress, auctionHouseSDK, auctionHouse])
  
  useEffect(() => {
    if (!auctionHouse || !curation) return
    (async () => { 
      const fees = await getSplitBalance(connection, auctionHouse.treasuryAccountAddress, curation.curator_fee)
      setCollectedFees(fees)
    })()
  }, [auctionHouse, curation])

  const handleBuyNowList = async (mint, price) => { 
    const listTxCookieId = `buyNowList-${ mint }-${ price }`

    try {
      const txHasFailed = getTxFailed(listTxCookieId)

      const mintPubkey = new PublicKey(mint)
    
      const listingTxBuilder = auctionHouseSDK.builders().list({
        auctionHouse,         // A model of the Auction House related to this listing
        seller: wallet,       // Creator of a listing
        mintAccount: mintPubkey,    // The mint account to create a listing for, used to find the metadata
        price: sol(price),    // The listing price (in SOL)
      })

      if (txHasFailed) {
        //if tx failed, check if the listing already exists onchain
        const existingListing = await findActiveListing({
          tokenPrice: price,
          mint
        })

        //if found skip sending a new TX
        //return that receipt so it gets recorded in the db
        if (existingListing) {
          setTxFailed(listTxCookieId, false)
          return {
            receipt: existingListing.receiptAddress.toString(),
            listTxCookieId
          }
        }

        //Check that the correct token account is associated with the mint
        //should be able to skip tokenAccount and transfer step for most mints (currently just for a bug in our edition mints)
        const [tokenAccount] = await findTokenAccountsByOwner(mintPubkey, wallet.publicKey)
        const ata = findATA(mintPubkey, wallet.publicKey, metaplex)
        if (tokenAccount.toString() !== ata.toString()) {
          const transferTokenAccountTx = getTransferNftTX(
            wallet.publicKey,
            wallet.publicKey,
            mint,
            tokenAccount
          )
          listingTxBuilder.prepend(...transferTokenAccountTx.instructions.map(i => ({
            instruction: i,
            signers: []
          })))
        }
      }

      const { receipt } = listingTxBuilder.getContext();

      const listTx = await makeTxWithPriorityFeeFromMetaplexBuilder(listingTxBuilder, wallet.publicKey)

      const signature = await signAndConfirmTx({
        tx: listTx,
        errorMessage: "Error confirming Buy Now List tx",
        wallet,
        commitment: "finalized"
      })

      setTxFailed(listTxCookieId, false)
      return {
        signature,
        receipt: receipt.toString(),
        listTxCookieId
      }
    } catch (err) {
      const error = err.message
      setTxFailed(listTxCookieId, true) //setting true regardless cause user may reject tx that don't pass simulation

      if (error.includes(userRejectedText)) {
        console.log("User rejected Listing transaction")
        return {}
      } else {
        console.log("Error with Listing TX", error)
        return { error }
      }
    }
  }

  const handleMasterEditionList = async (token, price) => { 
    const listMasterEditionTxCookieId = `buyNowList-${ token.mint }-${ price }`
    // setMasterEditionMarketAddress(token.mint, "6rZLxpc8wCobMiqAWLgvQX2hT6nGSv1zAeD1saD6ajaw")
    // return
    try {
      const txHasFailed = getTxFailed(listMasterEditionTxCookieId)

      const listingRes = await getListedItem(token.mint)
  
      if (listingRes.status === "success") {
        const curationName = listingRes.curationName.replaceAll("_", " ")
        const errorMessage = `${ token.name } is already listed in ${ curationName }`
        error(errorMessage) //extra feedback for user
        throw new Error(errorMessage)
      }

      if (txHasFailed) {
        //check if a previous master edition market is still valid
        const recoveredMarketAddress = await confirmActiveMasterEditionMarket(token.mint, price)

        //if so skip TX and just update the database 
        if (recoveredMarketAddress) {
          setTxFailed(listMasterEditionTxCookieId, false)
          return {
            editionMarketAddress: recoveredMarketAddress,
            listMasterEditionTxCookieId,
            signature: true//just return true so it triggers the database call
          }
        }
      }


  
      //Handle master edition market creation and update to the curation_listing
      const {
        listMasterEditionTX,
        editionMarketAddress,
        signers
      } = await getListMasterEditionTX({
        connection: connection,
        masterEdition: token,
        editionPrice: Number(price),
        ownerPubkey: wallet.publicKey,
        // piecesPerWallet:
      })
  
      const priorityFeeIx = await getPriorityFeeInstruction(listMasterEditionTX)
      
      listMasterEditionTX.add(priorityFeeIx)
      
      //saving in a cookie in case the database doesn't receive it
      // setMasterEditionMarketAddress(token.mint, editionMarketAddress)

      listMasterEditionTX.partialSign(...signers)
      const signature = await signAndConfirmTx({
        tx: listMasterEditionTX,
        errorMessage: "Error confirming ME List tx",
        wallet,
        // commitment: "finalized"
      })


      setTxFailed(listMasterEditionTxCookieId, false)
      return {
        signature,
        editionMarketAddress,
        listMasterEditionTxCookieId
      }
    } catch (err) {
      const error = err.message
      setTxFailed(listMasterEditionTxCookieId, true) //setting true regardless cause user may reject tx that don't pass simulation

      if (error.includes(userRejectedText)) {
        console.log("User rejected Listing Master Edition transaction")
        return {}
      } else {
        console.log("Error with Listing Master Edition TX", error)
        return { error }
      }
    }
  }

  const handleDelist = async (token) => {
    const listingReceipt = token.listing_receipt;
    const delistCookieId = `delist-${ listingReceipt }`

    try {
      const txHasFailed = getTxFailed(delistCookieId)

      let activeReceipt = listingReceipt;
      if (txHasFailed) {
        //find existing listings, if none match then just remove from database
        const activeListing = await findActiveListing({
          tokenPrice: token.buy_now_price,
          mint: token.mint
        })

        if (activeListing) activeReceipt = activeListing.receiptAddress
        else {
          //if not found skip sending a new TX, just delist in database
          setTxFailed(delistCookieId, false)
          return {
            delistCookieId,
            signature: true//just return true so it triggers the database call
          }
        }
      } 


      const listing = await auctionHouseSDK
        .findListingByReceipt({
          auctionHouse,
          receiptAddress: new PublicKey(activeReceipt),
          loadJsonMetadata: false
        });
        
      const delistBuilder = auctionHouseSDK.builders().cancelListing({
        auctionHouse,
        listing,
      })

      const delistTx = await makeTxWithPriorityFeeFromMetaplexBuilder(delistBuilder, wallet.publicKey)

      const signature = await signAndConfirmTx({
        tx: delistTx,
        errorMessage: "Error confirming Delist tx",
        wallet,
      })

      setTxFailed(delistCookieId, false)

      return {
        signature,
        delistCookieId
      }
      
    } catch (err) {
      const error = err.message
      if (error.includes(userRejectedText)) {
        console.log("User rejected Delist transaction")
        return {}
      } else {
        console.log("Error with Delist TX", error)
        setTxFailed(delistCookieId, true)
        return { error }
      }
    } 
  }

  const handleMasterEditionCloseAndWithdraw = async (token) => { 
    const withdrawCookieId = `masterEditionWithdraw-${ token.mint }-${ token.buy_now_price }`
    try {
      const txHasFailed = getTxFailed(withdrawCookieId)

      let marketAddress = token.master_edition_market_address

      if (txHasFailed) { 
        //if the ME token is in the owners wallet it means they've withdrawn it
        const onChainOwner = await getNftOwner(token.mint)
        if (onChainOwner.toString() === wallet.publicKey.toString()) {
          setTxFailed(withdrawCookieId, false)
          return {
            withdrawCookieId,
            signature: true//just return true so it triggers the database call
          }
        }
      }

      const { closeAndWithdrawMarketTX, signers } = await getCloseAndWithdrawMarketTX({
        connection: connection,
        ownerPubkey: wallet.publicKey,
        masterEditionMint: token.mint,
        marketAddress: marketAddress,
        feePoints: auctionHouse.sellerFeeBasisPoints,
        curationTreasuryAddress: auctionHouse.treasuryAccountAddress.toString()
      })
    
      const priorityFeeIx = await getPriorityFeeInstruction(closeAndWithdrawMarketTX)
  
      closeAndWithdrawMarketTX.add(priorityFeeIx)
  
      if (signers.length) closeAndWithdrawMarketTX.partialSign(...signers)
      const signature = await signAndConfirmTx({
        tx: closeAndWithdrawMarketTX,
        errorMessage: "Error confirming Close and Withdraw ME tx",
        wallet,
        // skipPreflight: true
      })

      setTxFailed(withdrawCookieId, false)

      return {
        signature,
        withdrawCookieId
      }
    } catch (err) { 
      const error = err.message
      setTxFailed(withdrawCookieId, true) //setting true regardless cause user may reject tx that don't pass simulation

      if (error.includes(userRejectedText)) {
        console.log("User rejected Close and Withdraw transaction")
        return {}
      } else {
        console.log("Error with Close and Withdraw TX", error)
        return { error }
      }
    }
  }

  const handleBuyNowPurchase = async (token) => { 
    const listingReceipt = token.listing_receipt
    const buyNowTxCookieId = `buyNowPurchase-${listingReceipt}`
    try {
      const txHasFailed = getTxFailed(buyNowTxCookieId)

      let activeReceipt = listingReceipt;
      if (txHasFailed) { 

        //confirm the nft has left the sellers wallet, if so update the database to unlisted
        const onChainOwner = await getNftOwner(token.mint)
        if (onChainOwner.toString() !== token.owner_address) {
          await updateListingStatus({
            apiKey: user.api_key,
            curationId: token.curation_id,
            tokenMint: token.mint,
            ownerAddress: onChainOwner.toString(),
            listedStatus: "unlisted",
            nftState: "invalid-listing"
          })
          throw new Error(`${ token.name } has sold`)
        } 

        //else look for active listings
        const activeListing = await findActiveListing({
          tokenPrice: token.buy_now_price,
          mint: token.mint
        })
        if (activeListing) activeReceipt = activeListing.receiptAddress
      } 
        
      const listing = await auctionHouseSDK
        .findListingByReceipt({
          auctionHouse,
          receiptAddress: new PublicKey(activeReceipt),
          loadJsonMetadata: false
        });

      if (!listing) throw new Error("Listing not found")

      const buyBuilder = await auctionHouseSDK.builders().buy({
        auctionHouse,
        listing,
      })

      const buyTx = await makeTxWithPriorityFeeFromMetaplexBuilder(buyBuilder, wallet.publicKey)

      const vTx = await getVersionedTxWithLookupTable(
        buyTx,
        LOOKUP_TABLE_ADDRESSES.AUCTION_HOUSE_BUY_NOW,
        wallet.publicKey
      )

      const signature = await signAndConfirmTx({
        tx: vTx,
        errorMessage: "Error confirming Buy Now Purchase tx",
        wallet,
      })
      
      setTxFailed(buyNowTxCookieId, false)
      return { signature }
    } catch (err) {
      const error = err.message
      if (error.includes(userRejectedText)) {
        console.log("User rejected Buy Now transaction")
        return {}
      } else {
        console.log("Error with Buy Now TX", error)
        setTxFailed(buyNowTxCookieId, true)
        return { error }
      }
    }   
  }

  const handleMasterEditionMint = async (token) => { 
    const marketAddress = token.master_edition_market_address
    const masterEditionMintTxCookieId = `editionMint-${ marketAddress }`

    try {
      const txHasFailed = getTxFailed(masterEditionMintTxCookieId)

      if (txHasFailed) {
        //update the listing with the true supply to make sure it hasn't sold out 
        const updateSupplyRes = await updateEditionSupply(token)

        if (updateSupplyRes?.listed_status === "sold") {
          throw new Error(`${ token.name } has sold out`)
        }
      }

      const { mintEditionTX, signers } = await getMintEditionTX({
        connection: connection,
        newOwnerPubkey: wallet.publicKey,
        masterEditionMint: token.mint,
        marketAddress: token.master_edition_market_address
      })

      const priorityFeeIx = await getPriorityFeeInstruction(mintEditionTX)

      mintEditionTX.add(priorityFeeIx)

      mintEditionTX.partialSign(...signers)

      const signature = await signAndConfirmTx({
        tx: mintEditionTX,
        errorMessage: "Error confirming Mint Edition tx",
        wallet,
      })

      setTxFailed(masterEditionMintTxCookieId, false)

      return {
        signature,
        masterEditionMintTxCookieId
      }
    } catch (err) {
      const error = err.message
      setTxFailed(masterEditionMintTxCookieId, true)
      if (error.includes(userRejectedText)) {
        console.log("User rejected Edition Mint transaction")
        return {}
      } else {
        console.log("Error with Edition Mint TX", error)
        return { error }
      }
    }   
  }

  const handleCollect = async (token) => {
    if (!user || !token) return;
    const isMasterEdition = token.is_master_edition
    const isEdition = token.is_edition
    if (isMasterEdition && token.master_edition_market_address) {
      //Handle Edition mint/purchase
      // const trueSupply = await getMasterEditionSupply(token.mint, metaplex)

      const mintRes = await handleMasterEditionMint(token)

      if (mintRes?.error) {
        error(`Error minting ${ token.name }: ${ mintRes.error }`)
      } else if (mintRes.signature) {

        success(`Congrats! ${ token.name } has been collected!`)
        shootConfetti(2)

        const res = await recordSale({
          apiKey: user.api_key,
          curationId: token.curation_id,
          token: token,
          buyerId: user.id,
          buyerAddress: wallet.publicKey.toString(),
          saleType: "edition_mint",
          txHash: mintRes.signature,
          editionsMinted: 1,
          // newSupply: trueSupply + 1
        })
        if (res?.status !== "success") {
          console.error(`Error recording edition mint sale for ${ token.name }: ${ res?.message }`)
        }

        if (res?.editionListingUpdateFailed) {
          setTimeout(() => {
            console.log("UPDATEING DELAY")
            updateEditionSupply(token)
          }, 1000*60) //wait 1 min for chain to update then update the supply
        }

        return true
      } 
    } else if (token.listing_receipt) {
      //Handle 1/1 and secondary edition buy now purchase
      
      const saleType = isEdition ? "secondary_edition" : "buy_now"

      const buyNowRes = await handleBuyNowPurchase(token)

      if (buyNowRes.error) {
        error(`Error collecting ${ token.name }: ${ buyNowRes.error }`)
      } else if (buyNowRes.signature) {

        success(`Congrats! ${ token.name } has been collected!`)
        shootConfetti(4)

        const res = await recordSale({
          apiKey: user.api_key,
          curationId: token.curation_id,
          token: token,
          buyerId: user.id,
          buyerAddress: wallet.publicKey.toString(),
          saleType: saleType,
          txHash: buyNowRes.signature,
        })

        if (res?.status !== "success") {
          console.error(`Error recording sale for ${ token.name }: ${ res?.message }`)
        }

        return true
      } 
    }
  }

  const findActiveListing = async ({ mint, tokenPrice }) => {
    const listings = await auctionHouseSDK.findListings({
      auctionHouse,
      mint: new PublicKey(mint),
    })

    return listings.find(l => {
      const correctAH = l.auctionHouse.address.toString() === auctionHouse.address.toString()
      const lPrice = l.price.basisPoints.toNumber() / LAMPORTS_PER_SOL;
      const correctPrice = lPrice === Number(tokenPrice)
      const active = l.canceledAt === null
      return correctAH && correctPrice && active
    })
  }

  const confirmActiveMasterEditionMarket = async (mint, price) => {
    //get ME market address from cookie
    const recoveredMarketAddress = getMasterEditionMarketAddress(mint)

    console.log("recovered MarketAddress:", recoveredMarketAddress)
    try {
      //make sure its still valid
      const marketPubkey = new PublicKey(recoveredMarketAddress);
      const marketAccount = await connection.getAccountInfo(marketPubkey);
      const [marketData] = Market.deserialize(marketAccount?.data);
      const marketPrice = marketData.price.toNumber() / LAMPORTS_PER_SOL;
      const correctPrice = marketPrice === Number(price)
      const correctOwner = marketData.owner.toString() === wallet.publicKey.toString()

      // enum MarketState {
      // 0:  Uninitialized,
      // 1:  Created,
      // 2:  Suspended,
      // 3:  Active,
      // 4:  Ended,
      // }
      const isActive = marketData.state === 3 || marketData.state === 1 

      const isValid = correctPrice && correctOwner && isActive
      if (isValid) return recoveredMarketAddress;
    } catch (err) {
      console.log("Error confirming ME market", err.message)
    }
    return null
  } 

  const updateEditionSupply = async (token) => {
    console.log("HITTTTT")
    const trueSupply = await getMasterEditionSupply(token.mint, metaplex)

    const updateSupplyRes = await updateEditionListing({
      token: token,
      supply: trueSupply,
      apiKey: user.api_key
    })

    return updateSupplyRes
  }

  return {
    handleBuyNowList,
    handleDelist,
    handleCollect,
    collectedFees,
    setCollectedFees,
    auctionHouse,
    handleMasterEditionCloseAndWithdraw,
    handleMasterEditionList
  }
}

export default useCurationAuctionHouse;
