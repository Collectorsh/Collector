import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { connection } from "../config/settings";
import NotFound from "../components/404";
import { Metaplex, bundlrStorage, keypairIdentity, storageModule, toMetaplexFile, toMetaplexFileFromBrowser, walletAdapterIdentity } from "@metaplex-foundation/js";
import FileDrop, { cleanFileName } from "../components/FileDrop";
import apiClient from "../data/client/apiClient";
import axios from "axios";
import { transferSol } from "../utils/solanaWeb3/transferSol";
import uploadCldImage from "../data/cloudinary/uploadCldImage";
import { getTokenCldImageId } from "../utils/cloudinary/idParsing";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileName, setImageFileName] = useState(null);

  const [nftName, setNftName] = useState("MINTING TEST 5");
  const [description, setDescription] = useState("this is a test");
  const [attributes, setAttributes] = useState([]);
  const [creators, setCreators] = useState();
  const [sellerFeeBasisPoints, setSellerFeeBasisPoints] = useState(10);
  
  useEffect(() => {
    if(!wallet.publicKey || creators?.length) return
    setCreators([{
      address: wallet.publicKey,
      verified: true,
      share: 100,
    }])
  }, [wallet, creators])
  
  return <NotFound />

  // const getListings = async () => {
  //   const auctionHouseAddress = "GV4TGS3iKnac5H4k9ShJk3FjPSvKZMVkJuUx5gcxkdmJ"
  //   const auctionHouseSDK = new Metaplex(connection)
  //     .use(walletAdapterIdentity(wallet))
  //     .auctionHouse()
    
  //   const auctionHouse = await auctionHouseSDK
  //     .findByAddress({ address: new PublicKey(auctionHouseAddress) });
    
    
  //   const listings = await auctionHouseSDK.findListings({ auctionHouse });
  //   console.log("🚀 ~ file: test.js:34 ~ getListings ~ listings:", listings.map(l => {
  //     return  l.sellerAddress.toString()
      
  //   }))
  // }

  const onDrop = (imageFile) => {
    setImageFileName(imageFile.name);
    setImageFile(imageFile);
    const reader = new FileReader();
    reader.onloadend = () => setImageBuffer(Buffer.from(reader.result));
    reader.readAsDataURL(imageFile);
  }

  const MintNft = async () => {
    const imgMetaplexFile = await toMetaplexFileFromBrowser(imageFile, imageFileName);

    const res = await apiClient.post("/script/upload_metadata", {
      imageBuffer: imageBuffer,
      nft: {
        creators,
        name: nftName,
        description: description,
        seller_fee_basis_points: sellerFeeBasisPoints,
        attributes: attributes,
      }
    }).then(res => res.data)
    console.log("🚀 ~ file: test.js:81 ~ MintNft ~ res:", res)

    if (res.status !== "success") {
      console.error("Error uploading metadata: ", res.error);
      return;
    }

    const uri = res.uri

    let newNft;

    try {
      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))

      const res = await metaplex
        .nfts()
        .create({
          uri,
          name: nftName,
          sellerFeeBasisPoints: sellerFeeBasisPoints,
          creators: creators,
          // maxSupply: toBigNumber(0), //default of 0 is 1/1
        });
      console.log("🚀 ~ file: test.js:129 ~ MintNft ~ res:", res)

      newNft = res.nft

      console.log(`Minted NFT: https://solscan.io/token/${ newNft.address }`);
    } catch (e) {
      console.error("Error minting NFT: ", e);
    }

    //Optimize newly minted NFT
    try {
      if (!newNft) return
      console.log("newNft: ", newNft)
      // const token = 
      // const cldId = getTokenCldImageId(token)
      // await uploadCldImage({

      // })
    } catch (e) {
      console.error("Error optimizing NFT: ", e);
    }

    return newNft
  }
  const MintNftWITH_TEMP_WALLET = async () => { 
    const imgMetaplexFile = await toMetaplexFileFromBrowser(imageFile, imageFileName);
 
    const bundlrFunderKeypair = Keypair.generate()
    
    const bundlrMetaplex = new Metaplex(connection)
      .use(keypairIdentity(bundlrFunderKeypair))
      .use(bundlrStorage())
    
    const bundlr = bundlrMetaplex.storage().driver()

    const uploadPrice = await bundlr.getUploadPriceForFiles([imgMetaplexFile]); // Get price for file size.
    console.log("🚀 ~ file: test.js:82 ~ MintNft ~ uploadPrice:", uploadPrice.basisPoints.toString())
    
    const returnAddress = await axios.post("/api/curations/fundBundlr", {
      addressToFund: bundlrFunderKeypair.publicKey.toString(),
      lamportsRequested: uploadPrice.basisPoints.toString(),
      apiKey: user.api_key
    }).then(res => res.data?.returnAddress)

    if (!returnAddress) {
      console.error("Error funding storage: ", e);
      return;
    }

    //wait
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log("🚀 ~file: DoneWaiting")

    let newNft;

    try {
      // await bundlr.fund(uploadPrice)
      // console.log("🚀 ~ funded")

      const imageUri = await bundlr.upload(imgMetaplexFile);
      console.log("🚀 ~ file: test.js:96 ~ MintNft ~ imageUri:", imageUri)

      const files = [{
        type: imgMetaplexFile.type,
        uri: imageUri
      }]

      const { uri } = await bundlrMetaplex
        .nfts()
        .uploadMetadata({
          name: nftName,
          description: description,
          image: imageUri,
          seller_fee_basis_points: sellerFeeBasisPoints,
          attributes: attributes,
          external_url: "",
          properties: {
            files,
            creators
          }
        });
      
      console.log('Metadata URI:', uri);
      
      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet))
      
      const res = await metaplex
        .nfts()
        .create({
          uri: uri,
          name: nftName,
          sellerFeeBasisPoints: sellerFeeBasisPoints,
          creators: creators,
          // maxSupply: toBigNumber(0), //default of 0 is 1/1
        });
      console.log("🚀 ~ file: test.js:129 ~ MintNft ~ res:", res)
      
      newNft = res.nft
      
      console.log(`Minted NFT: https://solscan.io/token/${ newNft.address }`);
    } catch (e) { 
      console.error("Error minting NFT: ", e);
    }

    //Try and recover and remaining funds
    try {
      // Withdraw funds from bundlr
      try {
        await bundlr.withdrawAll()
      } catch (e) {
        console.error("Error withdrawing funds from bundlr: ", e);
      }
  
      // Withdraw funds from bundlrFunder
      const balance = await connection.getBalance(bundlrFunderKeypair.publicKey);

      const toRefund = balance
      console.log("🚀 ~ file: test.js:131 ~ MintNft ~ balance:", toRefund)

      if (toRefund > 0) {
        const transferTX = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: bundlrFunderKeypair.publicKey,
            toPubkey: new PublicKey(returnAddress),
            lamports: toRefund,
          })
        );

        transferTX.feePayer = wallet.publicKey
        transferTX.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
        transferTX.partialSign(bundlrFunderKeypair)

       
        const signed = await wallet.signTransaction(transferTX)
        const sim = await connection.simulateTransaction(signed)
        console.log("🚀 ~ file: transferSol.js:15 ~ transferSol ~ sim :", sim)
        

        wallet.sendTransaction(transferTX, connection)

      }

    } catch (e) {
      console.error("Error closing temporary account: ", e);
    }

    //Optimize newly minted NFT
    try {
      if (!newNft) return
      console.log("newNft: ", newNft)
      // const token = 
      // const cldId = getTokenCldImageId(token)
      // await uploadCldImage({

      // })
    } catch (e) {
      console.error("Error optimizing NFT: ", e);
    }
  }
  // return <NotFound />
  return (
    <div>
      <MainNavigation />
      <h1 className="text-center my-20 ">Test Page</h1>
      <div className="h-[30rem] w-1/2 mx-auto">
        <FileDrop
          
          onDrop={onDrop}
        />

      </div>
      <MainButton onClick={MintNft} className="mx-auto block">Mint NFT</MainButton>
      {/* <MainButton onClick={getListings} className="mx-auto block">Get Listings</MainButton> */}
    </div>
  )
}