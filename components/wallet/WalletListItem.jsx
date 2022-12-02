import { WalletReadyState } from "@solana/wallet-adapter-base";
import React from "react";
import { Button } from "/components/wallet/Button";
import { WalletIcon } from "/components/wallet/WalletIcon";

export const WalletListItem = ({ handleClick, tabIndex, wallet }) => {
  return (
    <li>
      <Button
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}
      >
        {wallet.adapter.name}
        {wallet.readyState === WalletReadyState.Installed && (
          <span>Detected</span>
        )}
      </Button>
    </li>
  );
};
