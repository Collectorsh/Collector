import { createContext, useContext, useEffect, useState } from "react";
import { apiHost } from "../config/settings";
import axios from "axios";

export const RpcHealthContext = createContext();

const healthCheckInterval = 1000 * 60 * 2; // 2 minute

export const RPC_HEALTH = {
  UNKNOWN: "unknown",
  OK: "ok",
  ERROR: "error",
}

export const RpcHealthProvider = ({ children }) => {
  const [rpcStatus, setRpcStatus] = useState(RPC_HEALTH.UNKNOWN);

  useEffect(() => {
    // setRpcStatus(RPC_HEALTH.ERROR);
    const setStatus = async () => { 
      const health = await getHealth();
      setRpcStatus(health);
    }

    setStatus();

    const timerId = setInterval(async () => {
      setStatus()
    }, healthCheckInterval);

    return () => clearInterval(timerId);
  }, []);

  return <RpcHealthContext.Provider value={rpcStatus}>{children}</RpcHealthContext.Provider>;
};

const getHealth = async () => { 
  return axios.post(
    `https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`,
    {
      jsonrpc: '2.0',
      method: 'getHealth',
    }
  ).then((res) => {
    // console.log("🚀 ~ file: RpcHealth.js:28 ~ ).then ~ res:", res)
    switch (res.data.result) { 
      case "ok":
        return RPC_HEALTH.OK;
      default: //right now helius just returns "ok" or "error
        console.log("Unknown RPC Health:", res.data.result);
        return RPC_HEALTH.ERROR;
    }
  }).catch((err) => {
    console.log("Error Fetching RPC Health:", err);
    return RPC_HEALTH.ERROR;
  });
}