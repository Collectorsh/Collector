import { Metaplex, sol, walletAdapterIdentity, AuctionHouse } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, ba } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { connection } from "../config/settings";
import { getSplitBalance } from "../pages/api/curations/withdraw";
import UserContext from "../contexts/user";
import { getMintEditionTX } from "../utils/curations/mintEdition";
import recordSale from "../data/salesHistory/recordSale";
import { error, success } from "../utils/toast";
import { shootConfetti } from "../utils/confetti";
import retryFetches from "../utils/curations/retryFetches";

const DEBUG = false

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
    if(!wallet.connected || !auctionHouseAddress || auctionHouse) return
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
    try {

      const listingTxBuilder = auctionHouseSDK.builders().list({
        auctionHouse,         // A model of the Auction House related to this listing
        seller: wallet,       // Creator of a listing
        mintAccount: new PublicKey(mint),    // The mint account to create a listing for, used to find the metadata
        price: sol(price),    // The listing price (in SOL)
        // tokens: 1          // The number of tokens to list, for an NFT listing it must be 1 token
      })

      const { receipt } = listingTxBuilder.getContext();

      await metaplex.rpc().sendAndConfirmTransaction(
        listingTxBuilder,
        { commitment: "finalized" }
      )

      const listing = await retryFetches(async () => {
        const listing = await auctionHouseSDK.findListingByReceipt({
          auctionHouse,
          receiptAddress: new PublicKey(receipt),
          loadJsonMetadata: false
        })
        return listing.receiptAddress.toString();
      })

      if(!listing) throw new Error("Onchain listing not confirmed")      

      return listing
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelist = async (listingReceipt) => {
    try {
      const listing = await auctionHouseSDK
        .findListingByReceipt({
          auctionHouse,
          receiptAddress: new PublicKey(listingReceipt),
          loadJsonMetadata: false
        });

      const canceled = await auctionHouseSDK
        .cancelListing({
          auctionHouse,
          listing,
        })
      
      return canceled.response.signature
    } catch (error) {
      console.log(error)
    } 
  }

  const handleBuyNowPurchase = async (listingReceipt) => { 
    try {
      const listing = await auctionHouseSDK
        .findListingByReceipt({
          auctionHouse,
          receiptAddress: new PublicKey(listingReceipt),
          loadJsonMetadata: false
        });
  
      const bought = await auctionHouseSDK
        .buy({
          auctionHouse,
          listing,
        })
      return bought?.response?.signature
    } catch(error) {
      console.log(error)
    }
  }

  const handleCollect = async (token) => {
    if (!user || !token) return;
    const isMasterEdition = token.is_master_edition
    const isEdition = token.is_edition
    if (isMasterEdition && token.master_edition_market_address) {
      //Handle Edition mint/purchase
      let txHash
      try {
        const builder = await getMintEditionTX({
          connection: connection,
          newOwnerPubkey: wallet.publicKey,
          masterEditionMint: token.mint,
          marketAddress: token.master_edition_market_address
        })

        if (!builder) {
          const err = new Error(`Error Building ${ token.name } Buy Edition Transaction`)
          throw new Error(err)
        }

        const { mintEditionTX } = builder

        txHash = await wallet.sendTransaction(mintEditionTX, connection)
      } catch (err) {
        console.log("Error sending edition buy tx", err.message)
      }

      const res = await recordSale({
        apiKey: user.api_key,
        curationId: token.curation_id,
        token: token,
        buyerId: user.id,
        buyerAddress: user.public_keys[0],
        saleType: "edition_mint",
        txHash: txHash,
        editionsMinted: 1
      })

      if (res?.status === "success") {
        success(`Congrats! You've collected a ${ token.name } Edition!`)
        shootConfetti(1)
      } else {
        error(`Error buying ${ token.name }: ${ res?.message }`)
      }
    } else if (isEdition) {
      //TODO Handle edition purchase
      return
    } else if (token.listing_receipt) {
      //Handle 1/1 buy now purchase
      const txHash = await handleBuyNowPurchase(token.listing_receipt)

      const res = await recordSale({
        apiKey: user.api_key,
        curationId: token.curation_id,
        token: token,
        buyerId: user.id,
        buyerAddress: user.public_keys[0],
        saleType: "buy_now",
        txHash: txHash,
      })

      if (res?.status === "success") {
        success(`Congrats! ${ token.name } has been collected!`)
        shootConfetti(3)
      } else {
        error(`Error buying ${ token.name }: ${ res?.message }`)
      }
    }
  }


  return { handleBuyNowList, handleDelist, handleCollect, collectedFees, setCollectedFees, auctionHouse }
}

export default useCurationAuctionHouse;