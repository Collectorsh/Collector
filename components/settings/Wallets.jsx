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
import { PlusIcon, XIcon } from "@heroicons/react/solid";

export default function Wallets() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [user, setUser] = useContext(UserContext);
  const [addingWallet, setAddingWallet] = useState(false);
  const [usingLedger, setUsingLedger] = useState(false);

  // Detect publicKey change and add wallet
  useEffect(() => {
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
      });      
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

      <div className="flex justify-start items-center gap-4 pl-1 mt-2">
        <MainButton
          solid
          onClick={addWallet}
          className="flex gap-2 items-center"
        >
          Link New Wallet
          <PlusIcon className="w-5 h-5" />
        </MainButton>
        
        <Switch
          checked={usingLedger}
          onChange={setUsingLedger}
          className={clsx(
            'bg-neutral-100 dark:bg-neutral-900',
            "border-neutral-200 dark:border-neutral-700 border-2",
            "relative inline-flex h-8 w-14 items-center rounded-full flex-shrink-0"
          )}
        >
          <span className="sr-only">Toggle Ledger</span>
          <span
            className={clsx(usingLedger ? 'translate-x-7' : 'translate-x-1',
              "inline-block h-5 w-5 transform rounded-full   transition bg-neutral-900 dark:bg-neutral-100"
            )}
          />
        </Switch>
        <p>I am {!usingLedger ? "not" : ""} using a Ledger</p>
      </div>
    </div>
  )

}

const AddressCard = ({ pubKey, isPrimary, onRemove }) => { 
  return (
    <div className={clsx(
      "flex justify-between items-center gap-2 w-full border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-lg",
      "border-b-2"
    )}>
      <p>
        <span className={clsx(!isPrimary && "hidden", "font-bold")}>Primary: </span>
        {pubKey}
      </p>
     
      <button onClick={onRemove} className={clsx("duration-200 hover:scale-105 active:scale-100 opacity-50 hover:opacity-100", isPrimary && "hidden")}>
        <XIcon className="w-5 h-5" />
      </button>
    </div>

  )
}
