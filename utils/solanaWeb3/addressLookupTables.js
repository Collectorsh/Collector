import { AddressLookupTableProgram, Transaction, TransactionMessage } from "@solana/web3.js";
import { connection } from "../../config/settings";
import { signAndConfirmTx } from "./signAndConfirm";
import { PublicKey } from "@solana/web3.js";
import { VersionedTransaction } from "@solana/web3.js";


export const LOOKUP_TABLE_ADDRESSES = {
  AUCTION_HOUSE_BUY_NOW: new PublicKey("GNDhxXWnxBLNmFzYEGMpV4pQPwR4MHefb9b1e1AWydb7")
}

export const getVersionedTxWithLookupTable = async (tx, tableAddress, payerKey) => { 
  const table = await getAddressLookUpTable(tableAddress)

  const messageV0 = new TransactionMessage({
    payerKey,
    recentBlockhash: tx.recentBlockhash,
    instructions: tx.instructions
  }).compileToV0Message([table])

  const txV0 = new VersionedTransaction(messageV0)

  return txV0
}


export const getAddressLookUpTable = async (address) => {
  const lookupTableAccount = (await connection.getAddressLookupTable(address)).value;

  // for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
  //   const address = lookupTableAccount.state.addresses[i];
  //   console.log(i, address.toBase58());
  // }

  return lookupTableAccount;
}

export const createAddressLookUpTable = async (wallet, tableAddresses) => {

  const slot = await connection.getSlot();

  const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    connection: connection,
    payer: wallet.publicKey,
    authority: wallet.publicKey,
    recentSlot: slot
  });
  console.log("LookupTableAddress:", lookupTableAddress.toString())

  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: wallet.publicKey,
    authority: wallet.publicKey,
    lookupTable: lookupTableAddress,
    addresses: tableAddresses,
  });

  const TX = new Transaction()
  TX.add(lookupTableInst)
  TX.add(extendInstruction)

  TX.feePayer = wallet.publicKey
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
  TX.recentBlockhash = blockhash

  const sig = await signAndConfirmTx({
    tx: TX,
    wallet,
  })
  console.log("lookup table signature:", sig)
}


export const getTxKeys = async (tx, filterCB) => { 
  let addresses = {}
  tx.instructions.forEach(inst => {
    addresses[inst.programId.toString()] = inst.programId
    inst.keys.forEach(k => {
      addresses[k.pubkey.toString()] = k.pubkey
    })
  })

  addresses = Object.values(addresses).filter(filterCB || ((a) => a.toString()))

  console.log("🚀 Address Keys:", addresses.map(a => a.toString()))
  return addresses;
}

export const condenseAddresses = (keyGroups) => { 
  let keys = {}
  keyGroups.forEach((keyGroup) => { 
    keyGroup.forEach((key) => { 
      if (!keys[key]) keys[key] = 1;
      else keys[key] += 1;
    })
  })
  console.log("Keys:", keys)

  const condensedKeys = []
  Object.entries(keys).forEach(([key, count]) => { 
    if (count === keyGroups.length) condensedKeys.push(key)
  })
  
  console.log("Condensed Keys:", condensedKeys)

  return condensedKeys.map(k => new PublicKey(k))
}

//stored on chain but keeping for reference
const AUCTION_HOUSE_BUY_NOW_ADDRESSES = [
  "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk",
  "So11111111111111111111111111111111111111112",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "11111111111111111111111111111111",
  "SysvarRent111111111111111111111111111111111",
  "Sysvar1nstructions1111111111111111111111111",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  "HS2eL9WJbh7pA4i4veK3YDwhGLRjY3uKryvG1NbHRprj",
  "ComputeBudget111111111111111111111111111111"
]

