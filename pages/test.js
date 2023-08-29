import { useContext } from "react";
import MainButton from "../components/MainButton"
import UserContext from "../contexts/user";
import createCuration from "../data/curation/createCuration";
import MainNavigation from "../components/navigation/MainNavigation";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, isIdentitySigner, sol, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "../config/settings";
import axios from "axios";

export default function TestPage() {
  const [user] = useContext(UserContext);
  const wallet = useWallet();
  const withdrawTreasury = async () => { 
    const result = await axios.post("/api/curations/withdraw",
      {
        privateKeyHash: "Z5lFJxPAmjJJ83oqyKfPgXgja0PouCS4rl0PP0tn5Nsxh/l9h6sDyfhEJrz6qVwgPfVTcHkIqkwFcDxF214XpNIdT0hubB9QSF6n6PoZ+NHCwlxT6n3pWmHk9mSJ8STWxYqIYfOZyE5oRpReiN1Dju1VOjA7HcRl5QUBwwUfNylBFbIwrz2gWSoWRfrDv5MwoN0gofp7xPcrgmi6Bw/8ljHhPLDT1AkWKhxGFf5tBujGesZqQWiXJJ5fcaN7X8Sap6x2olD8ho3iPACieNp6+9gOZ3XOQe4s4R2MYSh7F939Tr/KLErPVxA/B3uh0gyjyngnIMfSIcE3p47a5g8gVw==",
        hydraName: "curation-Genesis-59Zzr",
        curatorWithdrawalPubkey: "3sSaxsDthaDVrUJQ6h1kVPCfvasoJFsG4Dbvi1LL8fPk",
        auctionHouseAddress: "BECecMZ69JfLaybvVqN3bvpSSRJB9p4ggdUfLW3oxbd5"
      },
    ).then(res => res.data)
  }

  return (
    <div>
      <MainNavigation />
      <h1 className="text-center mt-20 ">Test Page</h1>
      <MainButton className="mx-auto block" onClick={withdrawTreasury}>Withdraw Treasury</MainButton>

    </div>
  )
}