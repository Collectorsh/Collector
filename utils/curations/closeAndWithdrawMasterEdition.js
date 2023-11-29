import { LAMPORTS_PER_SOL, PublicKey, SYSVAR_CLOCK_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { findVaultOwnerAddress, findPrimaryMetadataCreatorsAddress, findTreasuryOwnerAddress, Market, SellingResource, createCloseMarketInstruction, createClaimResourceInstruction, findPayoutTicketAddress, createWithdrawInstruction } from "@metaplex-foundation/mpl-fixed-price-sale";
import { createTokenAccount } from "./createTokenAccount";

export const getCloseAndWithdrawMarketTX = async ({
  connection,
  ownerPubkey,
  masterEditionMint,
  marketAddress,
  feePoints,
  curationTreasuryAddress
}) => {
  const masterEditionPubkey = new PublicKey(masterEditionMint)
  const marketPubkey = new PublicKey(marketAddress)

  const marketAccount = await connection.getAccountInfo(marketPubkey);
  const [marketData] = Market.deserialize(marketAccount?.data);
  const treasuryMintPubkey = marketData.treasuryMint
  const treasuryHolderPubkey = marketData.treasuryHolder
  const sellingResourcePubkey = marketData.sellingResource
  const storePubkey = marketData.store

  const sellingResourceAccount = await connection.getAccountInfo(sellingResourcePubkey);
  const [sellingResourceData] = SellingResource.deserialize(sellingResourceAccount?.data);
  const vaultPubkey = sellingResourceData.vault
  const sellingResourceOwnerPubkey = sellingResourceData.owner

  const mainTX = new Transaction();
  const signers = []

  // return
  if (!marketData.endDate) {
    //CLOSE MARKET
    const closeMarketInstruction = createCloseMarketInstruction({
      market: marketPubkey,
      owner: ownerPubkey,
      clock: SYSVAR_CLOCK_PUBKEY,
    });
    mainTX.add(closeMarketInstruction)
  }


  //WITHDRAW MARKET
  const [payoutTicket, payoutTicketBump] = await findPayoutTicketAddress(
    marketPubkey,
    ownerPubkey,
  );

  const [treasuryOwner, treasuryOwnerBump] = await findTreasuryOwnerAddress(
    treasuryMintPubkey,
    sellingResourcePubkey,
  );

  const [vaultOwner, vaultOwnerBump] = await findVaultOwnerAddress(masterEditionPubkey, storePubkey);

  //useAssociatedTokenAddress for non native sol tokens
  const treasuryDestination = ownerPubkey//await getAssociatedTokenAddress(treasuryMintPubkey, wallet.publicKey);

  const metaplex = Metaplex.make(connection);
  const pdas = metaplex.nfts().pdas();
  const metadata = pdas.metadata({ mint: masterEditionPubkey });

  const [primaryMetadataCreatorsPubkey, primaryMetadataCreatorsBump] = await findPrimaryMetadataCreatorsAddress(metadata);
  // const creatorsAccount = await connection.getAccountInfo(primaryMetadataCreatorsPubkey);
  // const [creatorsAccountData] = PrimaryMetadataCreators.deserialize(creatorsAccount?.data);
  const primaryMetadataCreators = [primaryMetadataCreatorsPubkey]//creatorsAccountData.creators
  const remainingAccounts = [];
  
  for (const creator of primaryMetadataCreators) {
    remainingAccounts.push({ pubkey: creator, isWritable: true, isSigner: false });
  }

  const withdrawInstruction = createWithdrawInstruction(
    {
      market: marketPubkey,
      sellingResource: sellingResourcePubkey,
      metadata,
      treasuryHolder: treasuryHolderPubkey,
      treasuryMint: treasuryMintPubkey,
      owner: treasuryOwner,
      destination: treasuryDestination,
      funder: ownerPubkey,
      payer: ownerPubkey,
      payoutTicket: payoutTicket,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      anchorRemainingAccounts: remainingAccounts,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
    {
      treasuryOwnerBump,
      payoutTicketBump,
    },
  );
  mainTX.add(withdrawInstruction)


  //TODO should make sure the account is active somehow (may need to reactivate in some cases)
  const claimTokenPubkey = await getAssociatedTokenAddress(masterEditionPubkey, ownerPubkey)

  //seems to cause problems when relisting (probably shouldnt be creating a new cliam token?)
  // const { tokenAccount: claimToken, createTokenTx } = await createTokenAccount({
  //   payer: ownerPubkey,
  //   mint: masterEditionPubkey,
  //   connection,
  // });
  // const claimTokenPubkey = claimToken.publicKey
  // mainTX.add(createTokenTx)
  // signers.push(claimToken)
  

  const claimResourceInstruction = createClaimResourceInstruction(
    {
      market: marketPubkey,
      treasuryHolder: treasuryHolderPubkey,
      sellingResource: sellingResourcePubkey,
      sellingResourceOwner: sellingResourceOwnerPubkey,
      vault: vaultPubkey,
      metadata,
      owner: vaultOwner,
      destination: claimTokenPubkey,
      tokenMetadataProgram: MetadataProgram.PUBKEY,
      clock: SYSVAR_CLOCK_PUBKEY,
      // anchorRemainingAccounts: remainingAccounts,
    },
    {
      vaultOwnerBump,
    },
  );

  mainTX.add(claimResourceInstruction)

  //Send Fees to Curation Treasury
  const collectedFromMintLamports = await connection.getBalance(treasuryOwner)
  const minCollectionAmount = 0.01 * LAMPORTS_PER_SOL
  if (collectedFromMintLamports >= minCollectionAmount) {
    //fee points out of 10,000
    const feePercentage = feePoints/10000
    const curatorAndPlatformFeeAmount = Math.floor(collectedFromMintLamports * feePercentage)
    const collectFeeTX = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: ownerPubkey,
        toPubkey: new PublicKey(curationTreasuryAddress),
        lamports: curatorAndPlatformFeeAmount,
      }),
      new TransactionInstruction({
        keys: [{ pubkey: ownerPubkey, isSigner: true, isWritable: true }],
        data: Buffer.from(`Curator and Collector Platform Fee - ${feePercentage*100}%`),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    )
  
    mainTX.add(collectFeeTX)
  }

  mainTX.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  mainTX.feePayer = ownerPubkey;
  if (signers.length) mainTX.partialSign(...signers)

  return {
    closeAndWithdrawMarketTX: mainTX,
  }
}