import { useContext, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { connection } from "../config/settings";
import NotFound from "../components/404";
import { Metaplex, bundlrStorage, toMetaplexFile, walletAdapterIdentity } from "@metaplex-foundation/js";
import FileDrop, { cleanFileName } from "../components/FileDrop";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();
   

  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);

  const [nftName, setNftName] = useState("MINTING TEST");
  const [description, setDescription] = useState("this is a test");
  const [attributes, setAttributes] = useState([]);
  const [sellerFeeBasisPoints, setSellerFeeBasisPoints] = useState(10);
  
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

    const reader = new FileReader();
    reader.onloadend = () => setImageBuffer(Buffer.from(reader.result));
    reader.readAsDataURL(imageFile);
  }


  const MintNft = async () => { 

    // const CONFIG = {
    //   // uploadPath: 'uploads/',
    //   // imgFileName: fileName,
    //   imgType: 'image/png',
    //   imgName: 'QuickNode Pixel',
    //   description: 'Pixel infrastructure for everyone!',
    //   attributes: [
    //     { trait_type: 'Speed', value: 'Quick' },
    //     { trait_type: 'Type', value: 'Pixelated' },
    //     { trait_type: 'Background', value: 'QuickNode Blue' }
    //   ],
    //   sellerFeeBasisPoints: 500,//500 bp = 5%
    //   // symbol: 'QNPIX',
    //   creators: [
    //     { address: wallet.publicKey, share: 100 }
    //   ]
    // };

    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

    const imgMetaplexFile = toMetaplexFile(imageBuffer, imageFileName);
    console.log("🚀 ~ file: test.js:74 ~ MintNft ~ imgMetaplexFile:", imgMetaplexFile)

    //TODO upload video if needed

    //fund the storage based on file size
    const bundlrStorage = metaplex.storage().driver()
    try {
      //tODO add video file here
      const res = await bundlrStorage.fund([imgMetaplexFile]); // Fund using file size.
      console.log("🚀 ~ file: test.js:81 ~ MintNft ~ res:", res)
    } catch (e) {
      console.error("Error funding storage: ", e);
      return;
    }
    return


    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    console.log("Image URI: ", imgUri);

    const videoUri = "...TODO"

    const files = [
      {
        type: imgMetaplexFile.extension,
        uri: imgUri,
      },
      //add video if needed
    ]

    const creators = [
      {
        address: wallet.publicKey,
        share: 100
      }
      //extra creators if needed
    ]

    const { uri } = await metaplex 
      .nfts()
      .uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        seller_fee_basis_points: sellerFeeBasisPoints,
        attributes: attributes,
        external_url: "",
        properties: {
          files,
          creators
        }
      });
    console.log('Metadata URI:', uri);

    const { nft } = await metaplex
      .nfts()
      .create({
        uri: uri,
        name: nftName,
        sellerFeeBasisPoints: sellerFeeBasisPoints,
        symbol: "",
        creators: creators,
        isMutable: false,
        // maxSupply: toBigNumber(0), //default of 0 is 1/1
      });
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${ nft.address }`);

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