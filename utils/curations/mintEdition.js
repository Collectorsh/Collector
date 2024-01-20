import { Keypair, PublicKey, SYSVAR_CLOCK_PUBKEY, SystemProgram, Transaction } from "@solana/web3.js";
import { MintLayout, TOKEN_PROGRAM_ID, createInitializeMintInstruction, createMintToInstruction } from "@solana/spl-token";
import { findVaultOwnerAddress, findTradeHistoryAddress, createBuyInstruction, Market, SellingResource } from "@metaplex-foundation/mpl-fixed-price-sale";
import { Metaplex, toBigNumber } from "@metaplex-foundation/js";
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { findATA } from "./findTokenAccountsByOwner";

export const getMintEditionTX = async ({
  connection,
  newOwnerPubkey,
  masterEditionMint,
  marketAddress
}) => {
  const masterEditionPubkey = new PublicKey(masterEditionMint)
  const marketPubkey = new PublicKey(marketAddress)

  const marketAccount = await connection.getAccountInfo(marketPubkey);
  const [marketData] = Market.deserialize(marketAccount?.data);

  const storePubkey = marketData.store
  const sellingResourcePubkey = marketData.sellingResource
  const treasuryOwner = marketData.treasuryOwner //use for non native SOL
  const treasuryHolder = marketData.treasuryHolder

  const sellingResourceAccount = await connection.getAccountInfo(marketData.sellingResource);
  const [sellingResourceData] = SellingResource.deserialize(sellingResourceAccount?.data);
  const vaultPubkey = sellingResourceData.vault

  const mainTX = new Transaction();
  const signers = []

  const [vaultOwner, vaultOwnerBump] = await findVaultOwnerAddress(masterEditionPubkey, storePubkey);
  const [tradeHistory, tradeHistoryBump] = await findTradeHistoryAddress(
    newOwnerPubkey,
    marketPubkey,
  );

  const {
    mint: newMint,
    mintAta: newMintAta,
    mintTokenTX
  } = await getMintTokenToAccountTX({
    connection,
    payer: newOwnerPubkey,
  });

  mainTX.add(mintTokenTX)
  signers.push(newMint)

  console.log('New mint', newMint.publicKey.toBase58());

  const metaplex = Metaplex.make(connection);
  const pdas = metaplex.nfts().pdas();
  const newMintEdition = pdas.edition({ mint: newMint.publicKey });
  const newMintMetadata = pdas.metadata({ mint: newMint.publicKey });

  const resourceMintMasterEdition = pdas.edition({ mint: masterEditionPubkey });
  const resourceMintMetadata = pdas.metadata({ mint: masterEditionPubkey });
  const resourceMintEditionMarker = pdas.editionMarker({
    mint: masterEditionPubkey,
    edition: toBigNumber(1),
  });

  const additionalKeys = [];

  const buyInstruction = createBuyInstruction(
    {
      // buyer wallet
      userWallet: newOwnerPubkey,
      // user token account
      userTokenAccount: newOwnerPubkey,// for non native SOL -> treasuryOwner (but for new owner?),
      // resource mint edition marker PDA
      editionMarker: resourceMintEditionMarker,
      // resource mint master edition
      masterEdition: resourceMintMasterEdition,
      // resource mint metadata PDA
      masterEditionMetadata: resourceMintMetadata,
      // token account for selling resource
      vault: vaultPubkey,
      // account which holds selling entities
      sellingResource: sellingResourcePubkey,
      // owner of selling resource token account PDA
      owner: vaultOwner,
      // market account
      market: marketPubkey,
      // PDA which creates on market for each buyer
      tradeHistory,
      // market treasury holder (buyer will send tokens to this account)
      treasuryHolder: treasuryHolder,
      // newly generated mint address
      newMint: newMint.publicKey,
      // newly generated mint metadata PDA
      newMetadata: newMintMetadata,
      // newly generated mint edition PDA
      newEdition: newMintEdition,

      newTokenAccount: newMintAta,
      // newTokenAccount: newMintAta.publicKey, //deprecated

      // metaplex token metadata program address
      tokenMetadataProgram: MetadataProgram.PUBKEY,
      clock: SYSVAR_CLOCK_PUBKEY,
      // anchorRemainingAccounts: additionalKeys, //only for token gating
    },
    { tradeHistoryBump, vaultOwnerBump },
  );

  mainTX.add(buyInstruction)

  mainTX.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  mainTX.feePayer = newOwnerPubkey;

  return {
    mintEditionTX: mainTX,
    signers
  }
}

export const getMintTokenToAccountTX = async ({
  connection,
  payer,
}) => {
  const mintTokenTX = new Transaction();

  const { mint, createMintTx } = await CreateMint.createMintAccount(connection, payer);

  mintTokenTX.add(createMintTx);

 
  // const associatedToken = getAssociatedTokenAddressSync(mint.publicKey, payer);
  const associatedToken = findATA(mint.publicKey, payer)
  const createTokenTx = createAssociatedTokenAccountInstruction(
    payer,
    associatedToken,
    payer,
    mint.publicKey,
  )

  mintTokenTX.add(createTokenTx);

  mintTokenTX.add(createMintToInstruction(
    mint.publicKey,
    associatedToken,
    // associatedTokenAccount.publicKey,
    payer, 1)
  );

  return {
    mint,
    // mintAta: associatedTokenAccount,
    mintAta: associatedToken,
    mintTokenTX
  };
};

export class CreateMint extends Transaction {
  constructor(options, params) {
    const { feePayer } = options;
    if (feePayer === null) throw new Error('need to provide non-null feePayer');

    const { newAccountPubkey, lamports, decimals, owner, freezeAuthority } = params;

    super(options);

    this.add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey,
        lamports,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    this.add(
      createInitializeMintInstruction(
        newAccountPubkey,
        decimals ?? 0,
        owner ?? feePayer,
        freezeAuthority ?? feePayer,
      )
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