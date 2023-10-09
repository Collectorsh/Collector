import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram, Connection, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { formatRSAPrivateKey, formatRSAPublicKey } from "../../../utils/formatRSA";
import getKeyHash from "../../../data/key_hash/getHash";
import apiClient from "../../../data/client/apiClient";
import crypto from 'crypto'

export const PLATFORM_FEE_POINTS = 500 //5%
export const MAX_CURATOR_FEE_POINTS = 5000 //50%

export const platformWithdrawalPubkey = "Emfvfxo51M7huTFgakJCwHvHFmBbQMwWUTgjJK6grcF9"

const AUTHORITY_INIT_FUNDS = 0.02 * LAMPORTS_PER_SOL

const fundAccount = async (fundingKeypair, recipientPubkey, lamportsToFund = AUTHORITY_INIT_FUNDS) => {
  const fundingTX = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fundingKeypair.publicKey,
      toPubkey: recipientPubkey,
      lamports: lamportsToFund,
    }),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await sendAndConfirmTransaction(
    connection,
    fundingTX,
    [fundingKeypair],
    { commitment: 'finalized' }
  );
  console.log(`Funds sent to ${ recipientPubkey.toString() }`);
  console.log(`tx hash: ${ signature }`);
}

export default async function handler(req, res) {
  const { curationName, apiKey, curatorFee, curatorWithdrawalPubkey } = req.body;
  let authorityKeypair
  let fundingKeypair
  try {
    const curatorFeePoints = Math.round(Number.EPSILON + curatorFee * 100)
    const feePoints = PLATFORM_FEE_POINTS + curatorFeePoints

    if (curatorFeePoints > MAX_CURATOR_FEE_POINTS) throw new Error("Curator fee too high")

    //CREATE AUTHORITY KEYPAIR
    authorityKeypair = Keypair.generate()
    console.log("Authority Pubkey:", authorityKeypair.publicKey.toString())

    //Encrypt the authority secret key
    const encryptedSecretKey = crypto.publicEncrypt({
      key: formatRSAPublicKey(process.env.RSA_PUBLIC_KEY),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
      authorityKeypair.secretKey
    )

    //Fund the authority account
    const fundingHash = await getKeyHash("curation_authority_funds")
    const fundingPrivateKey = crypto.privateDecrypt(
      {
        key: formatRSAPrivateKey(process.env.RSA_PRIVATE_KEY),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(fundingHash, "base64")
    )
    fundingKeypair = Keypair.fromSecretKey(fundingPrivateKey)

    await fundAccount(fundingKeypair, authorityKeypair.publicKey)

    //CREATE AUCTION HOUSE
    const metaplex = new Metaplex(connection).use(keypairIdentity(authorityKeypair));

    const { auctionHouse } = await metaplex
      .auctionHouse()
      .create({
        sellerFeeBasisPoints: feePoints,
        authority: authorityKeypair,
        //withdrawals default to authority

        //ref https://docs.metaplex.com/programs/auction-house/auction-house-settings#require-sign-off
        // requireSignOff: true,
        // canChangeSalePrice: true,
        // hasAuctioneer: true, // to enable auctioneer
        // auctioneerAuthority: authorityKeypair???,
      });

    console.log("Auction house created:", auctionHouse.address.toString())

    //TODO might need to add this back in when dealing with auctions
    // const minBalance = LAMPORTS_PER_SOL * 0.005
    // await fundAccount(fundingKeypair, new PublicKey(auctionHouse.feeAccountAddress), minBalance)
    // console.log("Funded auction house")

    const apiResult = await apiClient.post("/curation/create", {
      name: curationName,
      api_key: apiKey,
      curator_fee: curatorFee,
      auction_house_address: auctionHouse.address.toString(),
      private_key_hash: encryptedSecretKey.toString('base64'),
      payout_address: curatorWithdrawalPubkey,
    }).then(res => res.data)

    return res.status(200).json(apiResult);
  } catch (err) {
    console.error("ERROR: ", err);
    console.log("====================================")
    try {
      const feeCost = 5005001 // in lamports //5000000 for rent, 5000 remains as fee for refund tx
      //TODO: close account to get rent back
      //https://yihau.github.io/solana-web3-demo/advanced/token/close-account.html

      const balanceLamports = await connection.getBalance(new PublicKey(authorityKeypair.publicKey));

      const refundAmount = balanceLamports// - feeCost
      if (refundAmount <= 0) throw new Error("Not enough balance to refund")

      const recoverTX = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: authorityKeypair.publicKey,
          toPubkey: fundingKeypair.publicKey,
          lamports: refundAmount,
        }),
      );

      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(
        connection,
        recoverTX,
        [authorityKeypair],
      );
      console.log('Recovered Funds', signature);
    } catch (err) {
      console.error("Funding recovery error: ", err);
    }
    return res.status(500).json({ error: err.message });
  }
}