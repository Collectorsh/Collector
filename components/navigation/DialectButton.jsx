import "@dialectlabs/react-ui/index.css";
import { useEffect, useMemo, useState } from "react";
import {
  NotificationsButton,
  DialectUiManagementProvider,
  DialectThemeProvider,
} from "@dialectlabs/react-ui";
import { DialectSolanaSdk } from "@dialectlabs/react-sdk-blockchain-solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function DialectButton() {
  const wallet = useWallet();
  const [theme, setTheme] = useState("dark");
  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] =
    useState(null);

  const DAPP_PUBLIC_KEY = new PublicKey(
    process.env.NEXT_PUBLIC_DIALECT_PUBLIC_KEY
  );

  const solanaWalletToDialectWallet = (wallet) => {
    if (
      !wallet.connected ||
      wallet.connecting ||
      wallet.disconnecting ||
      !wallet.publicKey
    ) {
      return null;
    }

    return {
      publicKey: wallet.publicKey,
      signMessage: wallet.signMessage,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
        ? async (pubKey) => {
            return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
          }
        : undefined,
    };
  };

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        setTheme(newColorScheme);
      });
  }, []);

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(wallet));
  }, [wallet]);

  const solanaConfig = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter,
    }),
    [dialectSolanaWalletAdapter]
  );

  const dialectConfig = useMemo(
    () => ({
      environment: "production",
      dialectCloud: {
        tokenStore: "local-storage",
      },
    }),
    []
  );

  return (
    <div className="mr-3">
      <DialectSolanaSdk
        config={dialectConfig}
        solanaConfig={solanaConfig}
        gate={() =>
          new Promise((resolve) => setTimeout(() => resolve(true), 3000))
        }
      >
        <DialectThemeProvider theme={theme}>
          <DialectUiManagementProvider>
            <NotificationsButton
              dialectId="dialect-notifications"
              notifications={[{ name: "Welcome message", detail: "On signup" }]}
              pollingInterval={15000}
              channels={["web3", "email", "sms", "telegram"]}
            />
          </DialectUiManagementProvider>
        </DialectThemeProvider>
      </DialectSolanaSdk>
    </div>
  );
}
