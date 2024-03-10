import React, { useEffect, useContext, useState } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import deleteWalletAddress from "/data/dashboard/deleteWalletAddress.js";
import verifyAddress from "/data/user/verifyAddress.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import MainButton from "../MainButton";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import * as Icon from 'react-feather'
import Checkbox from "../checkbox";

export default function Wallets() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [user, setUser] = useContext(UserContext);
  const [addingWallet, setAddingWallet] = useState(false);
  const [usingLedger, setUsingLedger] = useState(false);

  // Detect publicKey change and add wallet
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ wallet :", wallet)
    if (!wallet || !wallet.publicKey || !user || !addingWallet) return;
    wallet.connect().then(() => {
      if(!wallet.connected) return
      setAddingWallet(false);
      if (user.public_keys.includes(wallet.publicKey.toBase58())) return;

      verifyAddress(
        wallet.publicKey,
        wallet.signMessage,
        user.api_key,
        wallet.signTransaction,
        usingLedger
      ).then((res) => {
        if (!res) {
          console.log("No response from verifyAddress")
        } else if (res?.data?.status === "success") {
          success("Wallet added successfully");
          setUser(res.data.user);
        } else {
          error(res.data.msg);
        }
      }).catch((err) => { 
        console.log(err);
        const errorMessage = err.message.includes("Ledger") ? "Please select the Ledger checkbox to continue" : err.message
        error(errorMessage)
      })
              
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.connected, user]);
    

  const addWallet = () => {
    wallet.disconnect().then(() => {
      setAddingWallet(true);
      setVisible(true);
    });
  }

  const deleteWallet = (pubKey) => {
    
    deleteWalletAddress(pubKey, user.api_key)
      .then((res) => {
        if (res.data.status === "success") {
          success("Wallet removed");
          setUser(res.data.user);
        } else {
          error(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        error("An error has occurred");
      });
  }

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Wallets</p>

      <div className="p-1 flex flex-col gap-2">
        {user
          ? (user.public_keys.map((pubKey, index) => { 
            return <AddressCard
              key={pubKey}
              pubKey={pubKey}
              isPrimary={index === 0}
              onRemove={() => deleteWallet(pubKey)}
            />
          }))
        : null}

      </div>

      <div className="flex justify-start flex-wrap items-center gap-4 pl-1 mt-4">
        <MainButton
          solid
          onClick={addWallet}
          className="flex gap-2 items-center justify-center"
        >
          Link New Wallet
          <Icon.Plus size={20} strokeWidth={2.5}/>
        </MainButton>

        <Checkbox
          label={`I am using a Ledger`}
          checked={usingLedger}
          onChange={() => setUsingLedger(prev => !prev)}
        />
      </div>
    </div>
  )

}

const AddressCard = ({ pubKey, isPrimary, onRemove }) => { 
  return (
    <div className={clsx(
      "flex justify-between items-center gap-2 w-full palette2 px-4 py-2 rounded-lg shadow",
    )}>
      <p className="w-full">
        <span className={clsx(!isPrimary && "hidden", "font-bold")}>Primary:  </span>
        <span className="textPalette2 truncate inline-block w-full">{pubKey}</span>
      </p>
     
      <button onClick={onRemove} className={clsx("duration-300 opacity-50 hover:opacity-100", isPrimary && "hidden")}>
        <Icon.X size={20} strokeWidth={2.5}/>
      </button>
    </div>

  )
}
