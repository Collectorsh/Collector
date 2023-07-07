import { createContext, useContext, useEffect, useState } from "react";
import UserContext from "./user";
import { apiHost } from "../config/settings";

export const ActionCableContext = createContext();

export const ActionCableProvider = ({ children }) => {
  const [CableApp, setCableApp] = useState({});

  const loadConsumer = async () => {
    const { createConsumer } = await import("@rails/actioncable");
    return createConsumer;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && CableApp?.cable === undefined) {
      loadConsumer().then((createConsumer) => {
        const host = apiHost.replace("https", "ws").replace("http", "ws");
        setCableApp({
          cable: createConsumer(`${ host }/cable`),
        });
      });
    }
  }, [CableApp?.cable]);

  return <ActionCableContext.Provider value={CableApp.cable}>{children}</ActionCableContext.Provider>;
};

