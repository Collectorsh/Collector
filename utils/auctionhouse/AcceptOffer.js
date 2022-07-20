import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";
import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";

import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { concat } from "ramda";

const web3 = require("@solana/web3.js");

const {
  createCancelInstruction,
  createSellInstruction,
  createPrintListingReceiptInstruction,
  createExecuteSaleInstruction,
  createPrintPurchaseReceiptInstruction,
  createCancelListingReceiptInstruction,
} = AuctionHouseProgram.instructions;

export default async function acceptOfferTransaction(
  offer,
  listing,
  nft,
  creators,
  publicKey,
  signTransaction,
  refetch
) {
  if (!publicKey || !signTransaction || !offer || !nft) {
    return;
  }

  const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });

  const auctionHouse = new PublicKey(process.env.NEXT_PUBLIC_AUCTIONHOUSE);
  const authority = new PublicKey(
    process.env.NEXT_PUBLIC_AUCTIONHOUSE_AUTHORITY
  );
  const auctionHouseFeeAccount = new PublicKey(
    process.env.NEXT_PUBLIC_AUCTIONHOUSE_FEE_ACCOUNT
  );
  const tokenMint = new PublicKey(nft.mint);
  const treasuryMint = new PublicKey(
    process.env.NEXT_PUBLIC_AUCTIONHOUSE_TREASURY_MINT
  );
  const auctionHouseTreasury = new PublicKey(
    process.env.NEXT_PUBLIC_AUCTIONHOUSE_TREASURY
  );
  const tokenAccount = new PublicKey(nft.associatedTokenAccountAddress);
  const buyerPubkey = new PublicKey(offer.buyer);

  const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

  const [bidReceipt, _bidReceiptBump] =
    await AuctionHouseProgram.findBidReceiptAddress(
      new PublicKey(offer.tradeState)
    );

  const [sellerTradeState, sellerTradeStateBump] =
    await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      offer.price,
      1
    );

  const [buyerTradeState] =
    await AuctionHouseProgram.findPublicBidTradeStateAddress(
      buyerPubkey,
      auctionHouse,
      treasuryMint,
      tokenMint,
      offer.price,
      1
    );

  const [purchaseReceipt, purchaseReceiptBump] =
    await AuctionHouseProgram.findPurchaseReceiptAddress(
      sellerTradeState,
      buyerTradeState
    );

  const [escrowPaymentAccount, escrowPaymentBump] =
    await AuctionHouseProgram.findEscrowPaymentAccountAddress(
      auctionHouse,
      buyerPubkey
    );

  const [programAsSigner, programAsSignerBump] =
    await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

  const [freeTradeState, freeTradeStateBump] =
    await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );

  const [buyerReceiptTokenAccount] =
    await AuctionHouseProgram.findAssociatedTokenAccountAddress(
      tokenMint,
      buyerPubkey
    );

  const [listingReceipt, listingReceiptBump] =
    await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

  const sellInstructionAccounts = {
    wallet: publicKey,
    tokenAccount,
    metadata,
    authority,
    auctionHouse: auctionHouse,
    auctionHouseFeeAccount: auctionHouseFeeAccount,
    sellerTradeState: sellerTradeState,
    freeSellerTradeState: freeTradeState,
    programAsSigner: programAsSigner,
  };

  const sellInstructionArgs = {
    tradeStateBump: sellerTradeStateBump,
    freeTradeStateBump: freeTradeStateBump,
    programAsSignerBump: programAsSignerBump,
    buyerPrice: offer.price,
    tokenSize: 1,
  };

  const printListingReceiptInstructionAccounts = {
    receipt: listingReceipt,
    bookkeeper: publicKey,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const printListingReceiptInstructionArgs = {
    receiptBump: listingReceiptBump,
  };

  const executeSaleInstructionAccounts = {
    buyer: buyerPubkey,
    seller: publicKey,
    auctionHouse,
    tokenAccount,
    tokenMint,
    treasuryMint,
    metadata,
    authority,
    sellerTradeState,
    buyerTradeState,
    freeTradeState,
    sellerPaymentReceiptAccount: publicKey,
    escrowPaymentAccount,
    buyerReceiptTokenAccount,
    auctionHouseFeeAccount,
    auctionHouseTreasury,
    programAsSigner,
  };
  const executeSaleInstructionArgs = {
    escrowPaymentBump,
    freeTradeStateBump,
    programAsSignerBump,
    buyerPrice: offer.price,
    tokenSize: 1,
  };
  const executePrintPurchaseReceiptInstructionAccounts = {
    purchaseReceipt,
    listingReceipt,
    bidReceipt,
    bookkeeper: publicKey,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const executePrintPurchaseReceiptInstructionArgs = {
    purchaseReceiptBump: purchaseReceiptBump,
  };

  const createListingInstruction = createSellInstruction(
    sellInstructionAccounts,
    sellInstructionArgs
  );
  const createPrintListingInstruction = createPrintListingReceiptInstruction(
    printListingReceiptInstructionAccounts,
    printListingReceiptInstructionArgs
  );
  const executeSaleInstruction = createExecuteSaleInstruction(
    executeSaleInstructionAccounts,
    executeSaleInstructionArgs
  );
  const executePrintPurchaseReceiptInstruction =
    createPrintPurchaseReceiptInstruction(
      executePrintPurchaseReceiptInstructionAccounts,
      executePrintPurchaseReceiptInstructionArgs
    );

  const txt = new Transaction();

  txt
    .add(createListingInstruction)
    .add(createPrintListingInstruction)
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
    .add(executePrintPurchaseReceiptInstruction);

  if (listing) {
    const cancelInstructionAccounts = {
      wallet: publicKey,
      tokenAccount,
      tokenMint,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
      tradeState: new PublicKey(listing.tradeState),
    };
    const cancelListingInstructionArgs = {
      buyerPrice: listing.price,
      tokenSize: 1,
    };

    const cancelListingReceiptAccounts = {
      receipt: new PublicKey(listing.address),
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    const cancelListingInstruction = createCancelInstruction(
      cancelInstructionAccounts,
      cancelListingInstructionArgs
    );

    const cancelListingReceiptInstruction =
      createCancelListingReceiptInstruction(cancelListingReceiptAccounts);

    txt.add(cancelListingInstruction).add(cancelListingReceiptInstruction);
  }

  txt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  txt.feePayer = publicKey;

  let signed;

  try {
    signed = await signTransaction(txt);
  } catch (e) {
    if (e.message.startsWith("Transaction too large:")) {
      toast.error("Please cancel your listing before accepting the offer");
    } else {
      toast.error(e.message);
    }
    return;
  }

  try {
    toast("Sending the transaction to Solana.");

    await web3.sendAndConfirmRawTransaction(connection, signed.serialize());

    refetch();

    toast.success("The transaction was confirmed.");
  } catch (e) {
    toast.error(e.message);
  }
}
