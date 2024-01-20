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



export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  async function getEditionMarket() {

    const marketPubkey = new PublicKey("pePVycv5whYoCuppx1o39RrNEjJRoPqqoNxwkKHrAfW"); 

    const marketAccount = await connection.getAccountInfo(marketPubkey);
    const [marketData] = Market.deserialize(marketAccount?.data);
    console.log("🚀 ~ file: test.js:31 ~ getEditionMarket ~ marketData:", marketData)
    console.log("🚀 OWNER:", marketData.owner.toString())


    const sellingResourcePubkey = marketData.sellingResource
    const storePubkey = marketData.store
    const storeAccount = await connection.getAccountInfo(storePubkey);
    const [storeData] = Store.deserialize(storeAccount?.data);
    console.log("🚀 ~ file: test.js:35 ~ getEditionMarket ~ admin:", storeData.admin.toString())
    console.log("PRICE", marketData.price.toNumber() / LAMPORTS_PER_SOL)
    const sellingResourceAccount = await connection.getAccountInfo(sellingResourcePubkey);
    const [sellingResourceData] = SellingResource.deserialize(sellingResourceAccount?.data);
    console.log("🚀 ~ file: test.js:36 ~ getEditionMarket ~ sellingResourceData resource:", sellingResourceData.resource.toString())
  }

  const getOwner = async () => {
    const owner = await getNftOwner("6CkZzZk1uuPRGupiHDP3tKoNyBVv6SznwsF671ZEeyPC")
    console.log("🚀 ~ file: test.js:41 ~ getOwner ~ owner:", owner.toString())
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