import React, { useEffect, useContext, useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import getApiKey from "/data/user/getApiKey";
import UserContext from "/contexts/user";
import getUserFromApiKey from "/data/user/getUserFromApiKey";
import { H } from 'highlight.run';

const identifyHighlight = (wallet, user) => {
  if (!user?.username) return;
  H.identify(user.username, {
    id: user.id,
    primaryWallet: wallet?.publicKey?.toString() || "",
  });
}

export default function ConnectWallet() {
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  const asyncGetApiKey = async (publicKey, signMessage) => {
    if (!publicKey || !signMessage) return;

    let res = await getApiKey(publicKey, signMessage);
    if (res?.data.status === "success") {
      localStorage.setItem("api_key", res.data.user.api_key);
      setUser(res.data.user);
      identifyHighlight(wallet, res.data.user);
      setError(false);
    } else setError(true);
  }

  const asyncGetUser = async (apiKey, publicKey, signMessage) => {
    let res = await getUserFromApiKey(apiKey);
    if (res?.data.status === "success") {
      setUser(res.data.user);
      identifyHighlight(wallet, res.data.user);
    } else if (res?.data.status === "error" && res?.data.msg === "API Key not found") {
      localStorage.removeItem("api_key");
      if (publicKey && signMessage) await asyncGetApiKey(publicKey, signMessage);
    } else setError(true);
  }

  useEffect(() => {
    if(!wallet.connected) {
      setError(false);
    }
  }, [wallet])

  useEffect(() => {
    if (user?.api_key) return;
    if (fetching || error) return;
    if (!wallet || !wallet.connected) return;
    
    (async () => {
      setFetching(true)
      // Check for an API key first
      const apiKey = localStorage.getItem("api_key");
      try {
        if (apiKey) {
          await asyncGetUser(apiKey, wallet.publicKey, wallet.signMessage);
        } else {
          await asyncGetApiKey(wallet.publicKey, wallet.signMessage);
        }
        
      } catch (e) {
        setError(true);
        console.log("Error Signing In", e)
      }
      setFetching(false);
    })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, user, fetching, Error]);

  return null
}
