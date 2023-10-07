import { useContext, useEffect, useState } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";
import NotFound from "../components/404";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();
  
  return <NotFound />
  return (
    <div>
      <MainNavigation />
      <h1 className="text-center my-20 ">Test Page</h1>
      {/* <MainButton onClick={getListings} className="mx-auto block">Get Listings</MainButton> */}
    </div>
  )
}