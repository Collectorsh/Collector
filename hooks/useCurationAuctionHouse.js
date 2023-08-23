import { Metaplex, sol, walletAdapterIdentity, AuctionHouse } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, ba } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { connection } from "../config/settings";
import { PLATFORM_FEE_POINTS } from "../pages/api/curations/create";

const useCurationAuctionHouse = (curation) => {
  const wallet = useWallet();

  const [auctionHouse, setAuctionHouse] = useState(null);
  const [collectedFees, setCollectedFees] = useState(0);

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
    })()

  }, [wallet.connected, auctionHouseAddress, auctionHouseSDK, auctionHouse])
  
  useEffect(() => {
    if (!auctionHouse || !curation) return
    (async () => { 
      const balanceLamports = await connection.getBalance(new PublicKey(auctionHouse.feeAccountAddress));
      // Convert lamports to SOL
      const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
      
      const curatorFeePoints = curation.curator_fee * 100
      const totalPoints = curatorFeePoints + PLATFORM_FEE_POINTS
      const curatorFees = balanceSol * (curatorFeePoints / totalPoints)
      const platformFees = balanceSol * (PLATFORM_FEE_POINTS / totalPoints)

      const fees = {
        curator: curatorFees,
        platform: platformFees
      }
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
    console.log("🚀 ~ file: useAuctionHouse.js:63 ~ handleDelist ~ canceled:", canceled)
  }

  const handleBuyNowPurchase = async (listingReceipt) => { 
    console.log("🚀 ~ file: useAuctionHouse.js:67 ~ handleBuyNowPurchase ~ listingReceipt:", listingReceipt)
    const listing = await auctionHouseSDK
      .findListingByReceipt({
        auctionHouse,
        receiptAddress: new PublicKey(listingReceipt),
        loadJsonMetadata: false
      });
    console.log("🚀 ~ file: useAuctionHouse.js:73 ~ handleBuyNowPurchase ~ listing:", listing)

    const bought = await auctionHouseSDK
      .buy({
        auctionHouse,
        listing,
      })
    console.log("🚀 ~ file: test.js:99 ~ buyListing ~ bought:", bought)

    return bought.response.signature
  }


  // useEffect(() => {
  //   if (!auctionHouse) return
    
  //   const getListings = async (mint) => {
  //     return auctionHouseSDK.findListings({ auctionHouse });
  //   }

  //   (async () => {
  //     const listings = await getListings("4Ahy6nQnftgafYyuXsGiAKHsHRNcP8yghin6yMNcdYfd")
  //     console.log("🚀 ~ file: editListingsModal.jsx:23 ~ listings:", listings)
  //   })()
  // }, [auctionHouse, auctionHouseSDK])

  return { handleBuyNowList, handleDelist, handleBuyNowPurchase, collectedFees }
}

export default useCurationAuctionHouse;