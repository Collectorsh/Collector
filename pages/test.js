import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import NotFound from "../components/404";

import { connection } from "../config/settings";
import { findVaultOwnerAddress, findTradeHistoryAddress, Market, SellingResource } from "@metaplex-foundation/mpl-fixed-price-sale";
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
    const marketPubkey = new PublicKey("");
    const marketAccount = await connection.getAccountInfo(marketPubkey);
    const [marketData] = Market.deserialize(marketAccount?.data);
    console.log("🚀 ~ file: test.js:18 ~ getMarket ~ marketData:", marketData)

    console.log("PRICE", marketData.price.toNumber()/LAMPORTS_PER_SOL)

  }
  
  return <NotFound />
  return (
    <div>
      <MainNavigation />
      <h1 className="text-center my-20 ">Test Page</h1>
      {/* <MainButton onClick={getEditionMarket} className="mx-auto block">Get Market</MainButton> */}

    </div>
  )
}