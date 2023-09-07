import { Metaplex, sol, walletAdapterIdentity, AuctionHouse } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, ba } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { connection } from "../config/settings";
import { PLATFORM_FEE_POINTS } from "../pages/api/curations/create";
import { getSplitBalance } from "../pages/api/curations/withdraw";

const DEBUG = true

const useCurationAuctionHouse = (curation) => {
  const wallet = useWallet();

  const [auctionHouse, setAuctionHouse] = useState(null);
  const [collectedFees, setCollectedFees] = useState({
    curatorBalance: 0,
    platformBalance: 0
  });

  const auctionHouseAddress = curation?.auction_house_address

  const auctionHouseSDK = new Metaplex(connection)
    .use(walletAdapterIdentity(wallet))
    .auctionHouse()

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
      const listing = await auctionHouseSDK
        .list({
          auctionHouse,         // A model of the Auction House related to this listing
          seller: wallet,       // Creator of a listing
          mintAccount: new PublicKey(mint),    // The mint account to create a listing for, used to find the metadata
          price: sol(price),    // The listing price (in SOL)
          // tokens: 1          // The number of tokens to list, for an NFT listing it must be 1 token
        });
      return listing.receipt.toString()
      
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
      return bought.response.signature
    } catch(error) {
      console.log(error)
    }
  }

  return { handleBuyNowList, handleDelist, handleBuyNowPurchase, collectedFees, setCollectedFees, auctionHouse }
}

export default useCurationAuctionHouse;