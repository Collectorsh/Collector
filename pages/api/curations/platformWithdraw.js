import { Metaplex, keypairIdentity, Hydra, sol, lamports } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import crypto from 'crypto'
import { formatRSAPrivateKey } from "../../../utils/formatRSA";
import { platformWithdrawalPubkey } from "./createCuration";
import getKeyHash from "../../../data/key_hash/getHash";
import { signAndConfirmTxWithKeypairs } from "../../../utils/solanaWeb3/signAndConfirm";

export default async function handler(req, res) {
  const { auctionHouseAddress, keyHashName } = req.body;
  try {
    //If adding more platform auction houses, will need to fetch keyhash based on auction house address

    const authorityHash = await getKeyHash(keyHashName)
    const authorityPrivateKey = crypto.privateDecrypt(
      {
        key: formatRSAPrivateKey(process.env.RSA_PRIVATE_KEY),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(authorityHash, "base64")
    )
    const authorityKeypair = Keypair.fromSecretKey(authorityPrivateKey)

    const metaplex = new Metaplex(connection).use(keypairIdentity(authorityKeypair));

    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(auctionHouseAddress) });
    
    const balanceLamports = await connection.getBalance(new PublicKey(auctionHouse.treasuryAccountAddress));
    const balance = balanceLamports / LAMPORTS_PER_SOL;

    if (balance <= 0) throw new Error("No funds available to withdraw")

    await metaplex
      .auctionHouse()
      .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: sol(balance),
      });

    console.log(`Withdrawn ${ balance } SOL from Auction House Treasury`)

    //Build instructions for withdrawing the appropriate amount
    //withhold the two required fees (standard is 0.000005 Sol), 
    const AHwithdrawalFee = 0.000005
    const transferFee = 0.000005
    const fees = AHwithdrawalFee + transferFee;
    const platformWithdrawalAmount = Math.floor((balance - fees) * LAMPORTS_PER_SOL);

    const withdrawTX = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authorityKeypair.publicKey,
        toPubkey: new PublicKey(platformWithdrawalPubkey),
        lamports: platformWithdrawalAmount,
      }),
    );

    // Sign transaction, broadcast, and confirm
    const signature = await signAndConfirmTxWithKeypairs({
      tx: withdrawTX,
      keypairs: [authorityKeypair],
    });

    console.log("Withdrew from authority, signature:", signature)

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}