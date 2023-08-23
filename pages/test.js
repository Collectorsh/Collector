import { useContext } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import createCuration from "../data/curation/createCuration";
import MainNavigation from "../components/navigation/MainNavigation";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, isIdentitySigner, sol, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "../config/settings";
import axios from "axios";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  
  const handleCreate = async () => { 
    createCuration({
      name: "test1",
      apiKey: user.api_key,
      curatorFee: 5
    })
  }

  const mintKey = new PublicKey("GJCxyQnmeQRkJ8ou1jGLx2bLfZJ9DtC8ZLRJ65hxeobZ")
  // const mintKeyThank = new PublicKey("879dudGhwBNixj3TjvMKe2NLpXucQXWWNFwD21fe9ppD")
  const handleList = async () => { 
    if (!wallet.connected) return
    
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
    const auctionHouseSDK = metaplex.auctionHouse()
    
    const auctionHouse = await auctionHouseSDK
      .findByAddress({ address: new PublicKey("8wrkNqBHbAsMSRfTmncvgZ7e7zWZvCtbAwa5QRn51rJ3") });
    
    console.log("🚀 ~ file: test.js:32 ~ handleList ~ auctionHouse:", auctionHouse)
    
    // const pathToMyKeypair = "/Users/scottharlan/Desktop/EV3RETH/Code/collector/Art1dvzjFvQQfjehWPRtDoGrSkkb2TXRJgfMZZfE6mKz.json";
    // const keypairFile = fs.readFileSync(pathToMyKeypair);
    // const secretKey = Buffer.from(JSON.parse(keypairFile.toString()));
    // const authority = Keypair.fromSecretKey(secretKey);



    const issigner = isIdentitySigner(wallet)
    console.log("🚀 ~ file: test.js:47 ~ handleList ~ issigner:", issigner)

    const price = sol()
    const listing = await auctionHouseSDK
      .list({
        auctionHouse,         // A model of the Auction House related to this listing
        seller: wallet,       // Creator of a listing
        mintAccount: mintKey, // The mint account to create a listing for, used to find the metadata
        price: sol(1.2),             // The listing price (in SOL)
        // tokens: 1          // The number of tokens to list, for an NFT listing it must be 1 token
      });
    
    console.log("🚀 ~ file: test.js:38 ~ handleList ~ listing:", listing.receipt.toString())

  }

  const findListing = async () => { 
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))


    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("8wrkNqBHbAsMSRfTmncvgZ7e7zWZvCtbAwa5QRn51rJ3") });
    
    const listings = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse, mint: mintKey });
    console.log("🚀 ~ file: test.js:75 ~ findListing ~ listings:", listings)
    
    
  }


  const receipt = "FdZGknU6YBZEQZT8rDRqqYKCkqZMXJad116Cdfw1rDvK"

  const buyListing = async () => { 
    //  const pathToMyKeypair = "/Users/scottharlan/Desktop/EV3RETH/Code/collector/Art1dvzjFvQQfjehWPRtDoGrSkkb2TXRJgfMZZfE6mKz.json";
    // const keypairFile = fs.readFileSync(pathToMyKeypair);
    // const secretKey = Buffer.from(JSON.parse(keypairFile.toString()));
    // const keypair = Keypair.fromSecretKey(secretKey);
    // const metaplex  = new Metaplex(connection).use(keypairIdentity(keypair));
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
    console.log("🚀 ~ file: test.js:84 ~ buyListing ~ wallet:", wallet.publicKey.toString())


    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("8wrkNqBHbAsMSRfTmncvgZ7e7zWZvCtbAwa5QRn51rJ3") });
    
    const listing = await metaplex
      .auctionHouse()
      .findListingByReceipt({
        auctionHouse,
        receiptAddress: new PublicKey(receipt),
        loadJsonMetadata: false
      });
    console.log("🚀 ~ file: test.js:89 ~ buyListing ~ listing:", listing)

    const bought = await metaplex
      .auctionHouse()
      .buy({
        auctionHouse,
        listing,
        // price:1
      })
    console.log("🚀 ~ file: test.js:99 ~ buyListing ~ bought:", bought)
  }
  const getAuctionHouse = async () => { 
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))



    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("8wrkNqBHbAsMSRfTmncvgZ7e7zWZvCtbAwa5QRn51rJ3") });
    console.log("🚀 ~ file: test.js:123 ~ getAuctionHouse ~ auctionHouse:", )
    
    // console.log("aucionHouse fee", auctionHouse.feeAccountAddress.toString())
    // console.log("aucionHouse treasury", auctionHouse.treasuryAccountAddress.toString())
    // console.log("feeWithdrawalDestinationAddress", auctionHouse.feeWithdrawalDestinationAddress.toString())
    // console.log("treasuryWithdrawalDestinationAddress", auctionHouse.treasuryWithdrawalDestinationAddress.toString())
  }

  const withdrawTreasury = async () => { 
    const result = await axios.post("/api/curations/withdraw")
    console.log("🚀 ~ file: test.js:130 ~ withdrawTreasury ~ result:", result)
    
  }

  const uploadHash = async () => { 
    const result = await axios.post("/api/curations/uploadHash", {apiKey: user.api_key})
    console.log("🚀 ~ file: test.js:130 ~ withdrawTreasury ~ result:", result.data)
  }

  return (
    <div>
      <MainNavigation />
      <h1 className="text-center mt-20 ">Test Page</h1>
      <MainButton className="mx-auto block" onClick={handleCreate}>Create</MainButton>
      <MainButton className="mx-auto block" onClick={handleList}>List</MainButton>
      <MainButton className="mx-auto block" onClick={findListing}>Find Listing</MainButton>
      <MainButton className="mx-auto block" onClick={buyListing}>Buy Listing</MainButton>
      <MainButton className="mx-auto block" onClick={getAuctionHouse}>Get Auction House</MainButton>
      <MainButton className="mx-auto block" onClick={withdrawTreasury}>Withdraw Treasury</MainButton>
      <MainButton className="mx-auto block" onClick={uploadHash}>Upload Hash</MainButton>
    </div>
  )
}