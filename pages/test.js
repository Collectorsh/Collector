import { useContext } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import MainNavigation from "../components/navigation/MainNavigation";

import { useWallet } from "@solana/wallet-adapter-react";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  return (
    <div>
      <MainNavigation />
      {/* <h1 className="text-center my-20 ">Test Page</h1> */}
    </div>
  )
}