import React, { useEffect, useContext, useState } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import deleteWalletAddress from "/data/dashboard/deleteWalletAddress.js";
import verifyAddress from "/data/user/verifyAddress.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Wallets() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [user, setUser] = useContext(UserContext);
  const [addingWallet, setAddingWallet] = useState(false);
  const [usingLedger, setUsingLedger] = useState(false);

  function deleteWallet(event) {
    let pubKey = event.target.getAttribute("id");
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

  // Detect publicKey change and add wallet
  useEffect(() => {
    if (!wallet || !wallet.publicKey || !user || !addingWallet) return;
    wallet.connect().then(() => {
      setAddingWallet(false);
      if (user.public_keys.includes(wallet.publicKey.toBase58())) return;
      verifyAddress(
        wallet.publicKey,
        wallet.signMessage,
        user.api_key,
        wallet.signTransaction,
        usingLedger
      ).then((res) => {
        if (res.data.status === "success") {
          success("Wallet added successfully");
          setUser(res.data.user);
        } else {
          error(res.data.msg);
        }
      });
    });
  }, [wallet]);

  async function addWallet() {
    wallet.disconnect().then(() => {
      setAddingWallet(true);
      setVisible(true);
    });
  }

  return (
    <>
      <Toaster />
      <div>
        <div className="mt-8 lg:mt-16 pb-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2 clear-both mt-10">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Your Wallets
              </h3>
            </div>
            {user &&
              user.public_keys &&
              user.public_keys.map((publicKey, index) => {
                return (
                  <div
                    className="border-t border-gray-200 dark:border-dark1"
                    key={index}
                  >
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                          {publicKey}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {user.public_keys.length > 1 && (
                            <svg
                              onClick={deleteWallet}
                              id={publicKey}
                              className="w-4 h-4 cursor-pointer dark:fill-gray-100"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4l67.1-66.5-67.1-66.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0l66.5 67.1 66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.3 256l67.1 66.5z" />
                            </svg>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark2">
              <dt className="text-sm font-medium text-gray-500">
                <button
                  className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                  onClick={addWallet}
                >
                  Add Wallet
                </button>
                <div className="inline">
                  <input
                    type="checkbox"
                    className="inline ml-6"
                    onClick={() => setUsingLedger(!usingLedger)}
                  />
                  <p className="inline ml-2">I&apos;m using a ledger</p>
                </div>
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"></dd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
