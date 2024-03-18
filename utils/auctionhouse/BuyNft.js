import { rpcHost } from "/config/settings";
import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";
import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";

import { auctionHousesArray } from "/config/settings";

import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { concat } from "ramda";

const web3 = {}//require("@solana/web3.js");

const {
  createPublicBuyInstruction,
  createExecuteSaleInstruction,
  createPrintBidReceiptInstruction,
  createPrintPurchaseReceiptInstruction,
} = AuctionHouseProgram.instructions;

export default async function buyNftTransaction(
  nft,
  listing,
  creators,
  publicKey,
  signTransaction,
  refetch
) {
  const connection = new web3.Connection(rpcHost, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });

  const auctionHaus = auctionHousesArray.filter(
    (a) => a.address === listing.auctionHouse.address
  )[0];

  const auctionHouse = new PublicKey(auctionHaus.address);
  const authority = new PublicKey(auctionHaus.authority);
  const auctionHouseFeeAccount = new PublicKey(auctionHaus.feeAccount);
  const treasuryMint = new PublicKey(auctionHaus.treasuryMint);

  const seller = new PublicKey(listing.seller);
  const tokenMint = new PublicKey(nft.mint);

  const auctionHouseTreasury = new PublicKey(auctionHaus.treasury);

  const [listingReceipt, _listingReceiptBump] =
    await AuctionHouseProgram.findListingReceiptAddress(
      new PublicKey(listing.tradeState)
    );

  const sellerPaymentReceiptAccount = new PublicKey(listing.seller);
  const sellerTradeState = new PublicKey(listing.tradeState);
  const buyerPrice = listing.price;
  const tokenAccount = new PublicKey(nft.associatedTokenAccountAddress);
  const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

  const [escrowPaymentAccount, escrowPaymentBump] =
    await AuctionHouseProgram.findEscrowPaymentAccountAddress(
      auctionHouse,
      publicKey
    );

  const [buyerTradeState, tradeStateBump] =
    await AuctionHouseProgram.findPublicBidTradeStateAddress(
      publicKey,
      auctionHouse,
      treasuryMint,
      tokenMint,
      buyerPrice,
      1
    );

  const [freeTradeState, freeTradeStateBump] =
    await AuctionHouseProgram.findTradeStateAddress(
      seller,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );

  const [programAsSigner, programAsSignerBump] =
    await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

  const [buyerReceiptTokenAccount] =
    await AuctionHouseProgram.findAssociatedTokenAccountAddress(
      tokenMint,
      publicKey
    );

  const [bidReceipt, bidReceiptBump] =
    await AuctionHouseProgram.findBidReceiptAddress(buyerTradeState);

  const [purchaseReceipt, purchaseReceiptBump] =
    await AuctionHouseProgram.findPurchaseReceiptAddress(
      sellerTradeState,
      buyerTradeState
    );

  const publicBuyInstructionAccounts = {
    wallet: publicKey,
    paymentAccount: publicKey,
    transferAuthority: publicKey,
    treasuryMint,
    tokenAccount,
    metadata,
    escrowPaymentAccount,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    buyerTradeState,
  };

  const publicBuyInstructionArgs = {
    tradeStateBump,
    escrowPaymentBump,
    buyerPrice,
    tokenSize: 1,
  };

  const executeSaleInstructionAccounts = {
    buyer: publicKey,
    seller,
    tokenAccount,
    tokenMint,
    metadata,
    treasuryMint,
    escrowPaymentAccount,
    sellerPaymentReceiptAccount,
    buyerReceiptTokenAccount,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    auctionHouseTreasury,
    buyerTradeState,
    sellerTradeState,
    freeTradeState,
    programAsSigner,
  };

  const executeSaleInstructionArgs = {
    escrowPaymentBump,
    freeTradeStateBump,
    programAsSignerBump,
    buyerPrice,
    tokenSize: 1,
  };

  const printBidReceiptAccounts = {
    bookkeeper: publicKey,
    receipt: bidReceipt,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const printBidReceiptArgs = {
    receiptBump: bidReceiptBump,
  };

  const printPurchaseReceiptAccounts = {
    bookkeeper: publicKey,
    purchaseReceipt,
    bidReceipt,
    listingReceipt,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const printPurchaseReceiptArgs = {
    purchaseReceiptBump,
  };

  const publicBuyInstruction = createPublicBuyInstruction(
    publicBuyInstructionAccounts,
    publicBuyInstructionArgs
  );

  const printBidReceiptInstruction = createPrintBidReceiptInstruction(
    printBidReceiptAccounts,
    printBidReceiptArgs
  );

  const executeSaleInstruction = createExecuteSaleInstruction(
    executeSaleInstructionAccounts,
    executeSaleInstructionArgs
  );

  const printPurchaseReceiptInstruction = createPrintPurchaseReceiptInstruction(
    printPurchaseReceiptAccounts,
    printPurchaseReceiptArgs
  );

  const txt = new Transaction();

  txt
    .add(publicBuyInstruction)
    .add(printBidReceiptInstruction)
    .add(
      new TransactionInstruction({
        programId: AuctionHouseProgram.PUBKEY,
        data: executeSaleInstruction.data,
        keys: concat(
          executeSaleInstruction.keys,
          creators.map((creator) => ({
            pubkey: new PublicKey(creator.address),
            isSigner: false,
            isWritable: true,
          }))
        ),
      })
    )
    .add(printPurchaseReceiptInstruction);

  txt.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  txt.feePayer = publicKey;

  let signed;

  try {
    signed = await signTransaction(txt);
  } catch (e) {
    toast.error(e.message);
    return;
  }

  try {
    toast("Sending the transaction to Solana.");

    await web3.sendAndConfirmRawTransaction(connection, signed.serialize());

    refetch(nft);

    toast.success("The transaction was confirmed.");
  } catch (e) {
    toast.error(e.message);
  }
}
