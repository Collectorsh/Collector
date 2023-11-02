import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import NotFound from "../components/404";

import { connection } from "../config/settings";
import { findVaultOwnerAddress, findTradeHistoryAddress, Market, SellingResource } from "@metaplex-foundation/mpl-fixed-price-sale";
import { LAMPORTS_PER_SOL, PublicKey, } from "@solana/web3.js";



export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  async function getMarket() {
    const marketPubkey = new PublicKey("4fC2MoghSFz9H7nvJ1XzBJYtNrZj1Nx6wEZgpiCT6SeW");
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
      <MainButton onClick={getMarket} className="mx-auto block">Get Market</MainButton>
    </div>
  )
}