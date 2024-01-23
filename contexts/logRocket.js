import { useWallet } from "@solana/wallet-adapter-react";
import LogRocket from "logrocket";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import setupLogRocketReact from 'logrocket-react';
import UserContext from "./user";

const LogRocketContext = createContext();

export const LogRocketProvider = ({ children }) => {
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  const [alwaysRecord, setAlwaysRecord] = useState(false)
  const [logRocketInitialized, setLogRocketInitialized] = useState(false)
  
  useEffect(() => { 
    return // not using rocket log rn

    const randomRecordChance = user ? 0.75 : 0.25
    const randomlySelected = Math.random() < randomRecordChance
    const notDev = process.env.NEXT_PUBLIC_REACT_APP_STAGE !== "dev"
    const record = notDev && (randomlySelected || alwaysRecord)

    if (record && !logRocketInitialized) {
      console.log("LogRocket Init");
      LogRocket.init('dnqy5r/collector', {
        shouldParseXHRBlob: true,
      });
      setupLogRocketReact(LogRocket);
      setLogRocketInitialized(true)
    }

    if (user && record) {
      LogRocket.identify(String(user.id), {
        name: user.username,
        wallet_address: wallet.publicKey?.toString(),
        public_keys: user.public_keys,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, alwaysRecord])

  const handleSetAlwaysRecord = useCallback((newAlwaysRecord) => {
    if (alwaysRecord !== newAlwaysRecord) {
      setAlwaysRecord(newAlwaysRecord)
    }
  }, [alwaysRecord])

  return (
    <LogRocketContext.Provider value={{
      setAlwaysRecord: handleSetAlwaysRecord,
    }}>
      {children}
    </LogRocketContext.Provider>
  );
};

export default LogRocketContext;
