import React, { useEffect, useContext, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import getApiKey from "/data/user/getApiKey";
import UserContext from "/contexts/user";
import getUserFromApiKey from "/data/user/getUserFromApiKey";

export default function ConnectWallet() {
  const wallet = useWallet();
<<<<<<< HEAD
  const { setVisible } = useWalletModal();
=======
>>>>>>> main
  const [user, setUser] = useContext(UserContext);

  const asyncGetApiKey = useCallback(async (publicKey, signMessage) => {
    if (!publicKey || !signMessage) return;

    let res = await getApiKey(publicKey, signMessage);
    if (res.data.status === "success") {
      localStorage.setItem("api_key", res.data.user.api_key);
      setUser(res.data.user);
    }
  }, []);

  const asyncGetUser = useCallback(async (apiKey, publicKey, signMessage) => {
    let res = await getUserFromApiKey(apiKey);
    if (res.data.status === "success") {
      setUser(res.data.user);
    }
    if (res.data.status === "error" && res.data.msg === "API Key not found") {
      localStorage.removeItem("api_key");
      if (publicKey && signMessage) asyncGetApiKey(publicKey, signMessage);
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (!wallet || wallet.connected === false) return;
=======
    if (!wallet || !wallet.connected) return;
>>>>>>> main
    // Check for an API key first
    const apiKey = localStorage.getItem("api_key");
    if (apiKey) {
      asyncGetUser(apiKey, wallet.publicKey, wallet.signMessage);
    } else {
      asyncGetApiKey(wallet.publicKey, wallet.signMessage);
    }
  }, [wallet]);

  return (
    <div className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
      {/* <span onClick={logIn}>Sign In</span> */}
      <WalletMultiButton />
    </div>
  );
}
