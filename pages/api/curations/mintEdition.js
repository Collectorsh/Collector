import {  Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { formatRSAPrivateKey } from "../../../utils/formatRSA";
import crypto from 'crypto'
import { createTokenAccount } from "./listMasterEdition";

export default async function handler(req, res) {
  // get authority keypair
  const ev3_test_private_key_hash = "K6VYILvQgeodpXGkJ0OuUTxzwi0iy19WH6qk1WQIsvBAp6xzzv/qRHM+pnJkgAWIF08NK3LB8DHrrl+WnCmKd9ZFKHqknwY8K1KjDVXBFiJsv6F7MDSVltntAYJgNuq5HQbJFrYT3GVYS/4lfd2t0/gRu/YZ/A2eEBuhqnCs0wL2kzY+7yxwzQ4PJrsyZTwyW7f3cUGqeRuAmpZWGkhJl2wGxInh3KgcGbEEsMpM5UOS9t2bbX34f5Iy6UsQ1UYGyL9qHEdKqooZcK56lhrvL6bHUGDghWxaor+pFhlRhmdxd4u+fOivu+gics+7QAUzCuUK0r84lIOu8Lbavgh2CA=="
  const authorityPrivateKey = crypto.privateDecrypt(
    {
      key: formatRSAPrivateKey(process.env.RSA_PRIVATE_KEY),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(ev3_test_private_key_hash, "base64")
  )
  const authorityKeypair = Keypair.fromSecretKey(authorityPrivateKey)

  //Test store private key
  const privateKey = [127, 202, 32, 154, 137, 80, 230, 147, 191, 0, 9, 46, 41, 61, 144, 29, 147, 94, 243, 14, 41, 235, 91, 135, 171, 32, 16, 184, 26, 105, 135, 241, 81, 237, 250, 158, 254, 217, 92, 163, 105, 69, 123, 203, 90, 212, 168, 21, 19, 235, 89, 140, 78, 155, 44, 7, 159, 153, 160, 200, 96, 207, 137, 93]
  const storeKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKey))


  //user sent params
  const payer = authorityKeypair.publicKey //or should be minters address?
  
  
  const [tradeHistory, tradeHistoryBump] = await findTradeHistoryAddress(
    payer.publicKey,
    market.publicKey,
  );

  const { mint: newMint, mintAta } = await mintTokenToAccount({
    connection,
    payer: payer.publicKey,
    transactionHandler,
  });

  logDebug('new mint', newMint.publicKey.toBase58());

  const metaplex = Metaplex.make(connection);
  const pdas = metaplex.nfts().pdas();
  const newMintEdition = pdas.edition({ mint: newMint.publicKey });
  const newMintMetadata = pdas.metadata({ mint: newMint.publicKey });

  const resourceMintMasterEdition = pdas.edition({ mint: resourceMint.publicKey });
  const resourceMintMetadata = pdas.metadata({ mint: resourceMint.publicKey });
  const resourceMintEditionMarker = pdas.editionMarker({
    mint: resourceMint.publicKey,
    edition: toBigNumber(1),
  });

  await sleep(1000);

  const { tx: buyTx } = await createBuyTransaction({
    connection,
    buyer: payer.publicKey,
    userTokenAccount: userTokenAcc.publicKey,
    resourceMintMetadata,
    resourceMintEditionMarker,
    resourceMintMasterEdition,
    sellingResource: sellingResource.publicKey,
    market: market.publicKey,
    marketTreasuryHolder: treasuryHolder.publicKey,
    vaultOwner,
    tradeHistory,
    tradeHistoryBump,
    vault: vault.publicKey,
    vaultOwnerBump,
    newMint: newMint.publicKey,
    newMintEdition,
    newMintMetadata,
    newTokenAccount: mintAta.publicKey,
  });

  await transactionHandler.sendAndConfirmTransaction(buyTx, [payer]).assertSuccess(t);
}

export class CreateMint extends Transaction {
  constructor(options, params) {
    const { feePayer } = options;
   if(feePayer === null) throw new Error('need to provide non-null feePayer');

    const { newAccountPubkey, lamports, decimals, owner, freezeAuthority } = params;

    super(options);

    this.add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey,
        lamports,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );

    this.add(
      createInitializeMintInstruction(
        newAccountPubkey,
        decimals ?? 0,
        owner ?? feePayer,
        freezeAuthority ?? feePayer,
      ),
    );
  }

  static async createMintAccount(connection, payer) {
    const mint = Keypair.generate();

    const mintRent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span,
      'confirmed',
    );
    const createMintTx = new CreateMint(
      { feePayer: payer },
      {
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
      },
    );
    return { mint, createMintTx };
  }
}