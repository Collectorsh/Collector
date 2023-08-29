import { Metaplex, keypairIdentity, Hydra, sol, lamports } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import crypto from 'crypto' 
import { formatRSAPrivateKey } from "../../../utils/formatRSA";
import { PLATFORM_FEE_POINTS, platformWithdrawalPubkey } from "./create";

export const getSplitBalance = async (connection, treasuryAccountAddress, curatorFee) => {
  const balanceLamports = await connection.getBalance(new PublicKey(treasuryAccountAddress));
  
  // Convert to SOL 
  const balance = balanceLamports / LAMPORTS_PER_SOL;

  const curatorFeePoints = curatorFee * 100
  const totalPoints = curatorFeePoints + PLATFORM_FEE_POINTS
  const curatorSplit = (curatorFeePoints / totalPoints)
  const platformSplit = (PLATFORM_FEE_POINTS / totalPoints)

  return {
    curatorBalance: curatorSplit * balance,
    platformBalance: platformSplit * balance,
  }
}

export default async function handler(req, res) {
  const { privateKeyHash, curatorWithdrawalPubkey, auctionHouseAddress, curatorFee } = req.body;
  try {
    const authorityPrivateKey = crypto.privateDecrypt(
      {
        key: formatRSAPrivateKey(process.env.RSA_PRIVATE_KEY),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(privateKeyHash, "base64")
    )
    const authorityKeypair = Keypair.fromSecretKey(authorityPrivateKey)

    const metaplex = new Metaplex(connection).use(keypairIdentity(authorityKeypair));

    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(auctionHouseAddress) });
    
    const { curatorBalance, platformBalance } = await getSplitBalance(connection, auctionHouse.treasuryAccountAddress, curatorFee)
    const balance = curatorBalance + platformBalance
    if (balance <= 0) throw new Error("No funds available to withdraw")

    await metaplex
      .auctionHouse()
      .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: sol(balance),
      });
  
    console.log(`Withdrawn ${ balance } SOL from Auction House Treasury`)
    
    //Build instructions for withdrawing the appropriate amount to the curator/platform
    //withhold the two required fees (standard is 0.000005 Sol), split them between curator and platform
    const AHwithdrawalFee = 0.000005
    const transferFee = 0.000005
    const curatorWithdrawalAmount = Math.floor((curatorBalance - transferFee) * LAMPORTS_PER_SOL)
    const platformWithdrawalAmount = Math.floor((platformBalance - AHwithdrawalFee) * LAMPORTS_PER_SOL)
    const withdrawTX = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authorityKeypair.publicKey,
        toPubkey: new PublicKey(curatorWithdrawalPubkey),
        lamports: curatorWithdrawalAmount,
      }),
      SystemProgram.transfer({
        fromPubkey: authorityKeypair.publicKey,
        toPubkey: new PublicKey(platformWithdrawalPubkey),
        lamports: platformWithdrawalAmount,
      }),
    );
      
    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
      connection,
      withdrawTX,
      [authorityKeypair],
    );
    console.log("Withdrew from authority, signature:", signature )

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}