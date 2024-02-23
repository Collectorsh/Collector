import React, { useEffect, useContext, useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import getApiKey from "/data/user/getApiKey";
import UserContext from "/contexts/user";
import getUserFromApiKey from "/data/user/getUserFromApiKey";
import { H } from 'highlight.run';
import { success, error} from "../../utils/toast";

const identifyHighlight = (wallet, user) => {
  if (!user?.username) return;
  H.identify(user.username, {
    id: user.id,
    primaryWallet: wallet?.publicKey?.toString() || "",
  });
}

const checkWalletAddress = (wallet, user) => { 
  if (user.public_keys.includes(wallet.publicKey.toString())) return true;
  return false
}

export default function ConnectWallet() {
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState(false);

  const asyncGetApiKey = useCallback(async () => {
    let res = await getApiKey(wallet.publicKey, wallet.signMessage);
    if (res?.status === "success") {
      // if (checkWalletAddress(wallet, res.user)) {
        localStorage.setItem("api_key", res.user.api_key);
        setUser(res.user);
        identifyHighlight(wallet, res.user);
        setApiError(false);
      // }
    } else {
      error("Error Signing In")
      await wallet.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  const handleGetNewApiKey = useCallback(async () => {
    localStorage.removeItem("api_key");
    if (wallet.publicKey && wallet.signMessage) await asyncGetApiKey();
  }, [wallet, asyncGetApiKey])

  const asyncGetUser = useCallback(async (apiKey) => {
    let res = await getUserFromApiKey(apiKey);
    if (res?.status === "success") {
      if (checkWalletAddress(wallet, res.user)) {
        setUser(res.user);
        identifyHighlight(wallet, res.user);
      } else {
        await handleGetNewApiKey()
      }
    } else if (res?.status === "error" && res?.msg === "API Key not found") {
      await handleGetNewApiKey()
    } else {
      error("Error Signing In")
      await wallet.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, handleGetNewApiKey])


  useEffect(() => {
    if(!wallet.connected) {
      setApiError(false);
    }
  }, [wallet])

  useEffect(() => {
    if (user?.api_key) return;
    if (fetching || apiError) return;
    if (!wallet?.publicKey || !wallet?.signMessage) return;
    
    (async () => {
      setFetching(true)
      // Check for an API key first
      const apiKey = localStorage.getItem("api_key");
      try {
        if (apiKey) {
          await asyncGetUser(apiKey);
        } else {
          await asyncGetApiKey();
        }
        
      } catch (e) {
        console.log("Error Signing In", e)
        if (e.message.includes("rejected")) {
          //on rejected message, disconnect wallet
          await wallet.disconnect()
        } else {
          setApiError(true);
          error("Error Signing In")
        }
      }
      setFetching(false);
    })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, user]);

  return null
}
