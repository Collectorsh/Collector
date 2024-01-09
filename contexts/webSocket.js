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
        const host = apiHost.replace("https", "wss").replace("http", "ws");
        setCableApp({
          cable: createConsumer(`${ host }/cable`),
        });
      }).catch((err) => {
        console.log("Error loading action cable", err);
      });
    }
  }, [CableApp?.cable]);

  return <ActionCableContext.Provider value={CableApp.cable}>{children}</ActionCableContext.Provider>;
};

