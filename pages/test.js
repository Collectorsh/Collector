import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import NotFound from "../components/404";

import { connection } from "../config/settings";
import { Market, SellingResource, Store } from "@metaplex-foundation/mpl-fixed-price-sale";
import { LAMPORTS_PER_SOL, PublicKey, } from "@solana/web3.js";
import { findATA } from "../utils/curations/findTokenAccountsByOwner";
import { getNftOwner } from "../utils/solanaWeb3/getNftOwner";
import axios from "axios";



export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  async function getEditionMarket() {

    const marketPubkey = new PublicKey("pePVycv5whYoCuppx1o39RrNEjJRoPqqoNxwkKHrAfW"); 

    const marketAccount = await connection.getAccountInfo(marketPubkey);
    const [marketData] = Market.deserialize(marketAccount?.data);
    console.log("marketData:", marketData)

    const sellingResourcePubkey = marketData.sellingResource
    const storePubkey = marketData.store
    const storeAccount = await connection.getAccountInfo(storePubkey);
    const [storeData] = Store.deserialize(storeAccount?.data);
    console.log("admin/owner:", storeData.admin.toString())
    console.log("PRICE", marketData.price.toNumber() / LAMPORTS_PER_SOL)
    const sellingResourceAccount = await connection.getAccountInfo(sellingResourcePubkey);
    const [sellingResourceData] = SellingResource.deserialize(sellingResourceAccount?.data);
    console.log("sellingResourceData resource:", sellingResourceData.resource.toString())
  }

  const getOwner = async () => {
    const mint = "NTQLgcNjKBsuP9849hKFfWZLD8WXsN5eefJ2qhdNhUR"
    const owner = await getNftOwner(mint)
    console.log("owner:", owner.toString())
   
    const token = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`,
      {
        "jsonrpc": "2.0",
        "id": "string",
        "method": "getAsset",
        "params": {
          "id":mint,
          "displayOptions": {
            "showUnverifiedCollections": true,
            "showCollectionMetadata": true,
            "showFungible": false,
            "showInscription": false
          }
        }
      }
    ).then((res) => {
      return res.data.result;
    })
    console.log("🚀 ~ file: test.js:64 ~ getOwner ~ token:", token)

      
  }
  
  // return <NotFound />
  return (
    <div>
      <MainNavigation />
      <h1 className="text-center my-20 ">Test Page</h1>
      <MainButton onClick={getEditionMarket} className="mx-auto block">Get Market</MainButton>
      <MainButton onClick={getOwner} className="mx-auto block">Get Owner</MainButton>

    </div>
  )
}