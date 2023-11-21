import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import NotFound from "../components/404";

import { connection } from "../config/settings";
import { findVaultOwnerAddress, findTradeHistoryAddress, Market, SellingResource, Store } from "@metaplex-foundation/mpl-fixed-price-sale";
import { LAMPORTS_PER_SOL, PublicKey, } from "@solana/web3.js";
import axios from "axios";
import { Keypair } from "@solana/web3.js";
import getKeyHash from "../data/key_hash/getHash";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import crypto from 'crypto'
import { formatRSAPrivateKey } from "../utils/formatRSA";
import { PLATFORM_FEE_POINTS } from "./api/curations/createCuration";



export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  async function getEditionMarket() {
    const marketPubkey = new PublicKey("7UC3Q1V9kn9H9GwbxdY5obmwBBpMHh8xKAGddT4T4WSf"); //I see you
    const marketAccount = await connection.getAccountInfo(marketPubkey);
    const [marketData] = Market.deserialize(marketAccount?.data);
    console.log("🚀 ~ file: test.js:31 ~ getEditionMarket ~ marketData:", marketData)
    const sellingResourcePubkey = marketData.sellingResource
    const storePubkey = marketData.store
    const storeAccount = await connection.getAccountInfo(storePubkey);
    const [storeData] = Store.deserialize(storeAccount?.data);
    console.log("🚀 ~ file: test.js:35 ~ getEditionMarket ~ storeDataKey:", storeData.admin.toString())

    const sellingResourceAccount = await connection.getAccountInfo(sellingResourcePubkey);
    const [sellingResourceData] = SellingResource.deserialize(sellingResourceAccount?.data);
    console.log("🚀 ~ file: test.js:36 ~ getEditionMarket ~ sellingResourceData resource:", sellingResourceData.resource.toString())

    const marketPubkey2 = new PublicKey("EZmDKrAeuyER2fgfnb1U1JAyyDoDqQKLhMTgPcD4hRLa")
    const marketAccount2 = await connection.getAccountInfo(marketPubkey2);
    const [marketData2] = Market.deserialize(marketAccount2?.data);
    console.log("🚀 ~ file: test.js:36 ~ getEditionMarket ~ marketData2:", marketData2)
    const sellingResourcePubkey2 = marketData2.sellingResource
    const storePubkey2 = marketData2.store
    const storeAccount2 = await connection.getAccountInfo(storePubkey2);
    const [storeData2] = Store.deserialize(storeAccount2?.data);
    console.log("🚀 ~ file: test.js:35 ~ getEditionMarket ~ storeDataKey2:", storeData2.admin.toString())

    const sellingResourceAccount2 = await connection.getAccountInfo(sellingResourcePubkey2);
    const [sellingResourceData2] = SellingResource.deserialize(sellingResourceAccount2?.data);
    console.log("🚀 ~ file: test.js:36 ~ getEditionMarket ~ sellingResourceData2 REsource:", sellingResourceData2.resource.toString())
  }

  
  // return <NotFound />
  return (
    <div>
      <MainNavigation />
      <h1 className="text-center my-20 ">Test Page</h1>
      <MainButton onClick={getEditionMarket} className="mx-auto block">Get Market</MainButton>

    </div>
  )
}