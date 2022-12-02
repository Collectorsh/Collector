import React, { useState } from "react";
import { WalletModalContext } from "@solana/wallet-adapter-react-ui";
import { WalletModal } from "/components/wallet/WalletModal";

export const WalletModalProvider = ({ children, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      {visible && <WalletModal {...props} />}
    </WalletModalContext.Provider>
  );
};
