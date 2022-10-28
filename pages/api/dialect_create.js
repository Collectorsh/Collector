import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { idl, programs, Wallet_ } from "@dialectlabs/web3";

import { Dialect } from "@dialectlabs/sdk";

import {
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
} from "@dialectlabs/blockchain-sdk-solana";

export default async function handler(req, res) {
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_DIALECT_SDK_CREDENTIALS;
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(PRIVATE_KEY))
  );
  const wallet = Wallet_.embedded(keypair.secretKey);

  const environment = "production";

  const solana = {
    rpcUrl: process.env.NEXT_PUBLIC_RPC,
  };

  const sdk = Dialect.sdk(
    {
      environment,
      solana,
    },
    SolanaSdkFactory.create({
      wallet: wallet,
    })
  );

  try {
    const dapp = await sdk.dapps.create({
      name: "Collector",
      description: `Discover & Share Beautiful Art`,
    });
    return res.status(200).json({ dapp: dapp });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
