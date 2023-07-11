import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { SolletWalletAdapter } from "@solana/wallet-adapter-sollet";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";

import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export const WalletContextProvider = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  // You can also provide a custom RPC endpoint
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const endpoint = process.env.NEXT_PUBLIC_RPC;

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new GlowWalletAdapter(),
      new PhantomWalletAdapter(),
      // new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // // new TorusWalletAdapter(),
      new SolletWalletAdapter({ network }),
      // new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const onError = useCallback((error) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
