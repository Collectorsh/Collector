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
import apiClient, { apiNodeClient } from "../data/client/apiClient";
import axios from "axios";
import { transferSol } from "../utils/solanaWeb3/transferSol";
import uploadCldImage from "../data/cloudinary/uploadCldImage";
import { getTokenCldImageId } from "../utils/cloudinary/idParsing";
import { success } from "../utils/toast";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileName, setImageFileName] = useState(null);

  const [nftName, setNftName] = useState("TEST 9");
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

  const onDrop = (imageFile) => {
    setImageFileName(imageFile.name);
    setImageFile(imageFile);
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const base64String = event.target.result.split(',')[1];
      setImageBuffer(base64String);
    }
    reader.readAsDataURL(imageFile);
  }

  const MintNft = async () => {
    // const res = await axios.post("http://localhost:3333/node/upload-metadata", {
    //   imageBuffer,
    //   nft: {
    //     creators,
    //     name: nftName,
    //     description: description,
    //     seller_fee_basis_points: sellerFeeBasisPoints,
    //     attributes: attributes,
    //   }
    // }).then(res => res.data)

    const fileData = new FormData()
    fileData.append("imageFile", imageFile)
    fileData.append("nft", JSON.stringify({
      category: "image",//video, vr, html
      creators,
      name: nftName,
      description: description,
      seller_fee_basis_points: sellerFeeBasisPoints,
      attributes: attributes,
      external_url: "collector.sh"
    }))

    const res = await apiNodeClient.post("upload-metadata", fileData).then(res => res.data)

    console.log("🚀 ~ file: test.js:81 ~ MintNft ~ res:", res)

    if (res.error || !res.uri) {
      console.error("Error uploading metadata: ", res?.error);
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
    } catch (e) {
      console.error("Error optimizing NFT: ", e);
    }

    return newNft
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