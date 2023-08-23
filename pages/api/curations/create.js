import { Metaplex, keypairIdentity} from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram, Connection } from "@solana/web3.js";
import { formatRSAPrivateKey, formatRSAPublicKey } from "../../../utils/formatRSA";
import getKeyHash from "../../../data/key_hash/getHash";
import apiClient from "../../../data/client/apiClient";
import crypto from 'crypto'

import { mplHydra, MembershipModel, fetchFanout, findFanoutNativeAccountPda, findFanoutPda, init, addMemberWallet, distributeWallet} from "@metaplex-foundation/mpl-hydra";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { transactionBuilderGroup, keypairIdentity as umiKeypairIdentity } from "@metaplex-foundation/umi";
import { rpcHost } from "../../../config/settings";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

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
    { commitment: 'finalized'}
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

    //CREATE HYDRA WALLET
    const umiAuthorityIdentity = umiKeypairIdentity(fromWeb3JsKeypair(authorityKeypair), true)
   
    const umi = createUmi(rpcHost).use(umiAuthorityIdentity).use(mplHydra());
    
    const hydraName = `curation-${curationName}-${authorityKeypair.publicKey.toString().slice(0, 5)}`

    const [fanoutPubkey, bumpSeed] = findFanoutPda(umi, { name: hydraName });
    const [hydraAccountPubkey, nativeAccountBumpSeed] = findFanoutNativeAccountPda(umi, { fanout: fanoutPubkey });

    await init(umi, {
      bumpSeed,
      nativeAccountBumpSeed,
      name: hydraName,
      model: MembershipModel.Wallet,
      totalShares: feePoints,
    }).sendAndConfirm(umi);

    console.log("Hydra created")

    //Add hydra members
    const curatorMembership = addMemberWallet(umi, {
      member: new PublicKey(curatorWithdrawalPubkey),
      fanout: fanoutPubkey,
      shares: curatorFeePoints,
    })

    const platformMembership = addMemberWallet(umi, {
      member: new PublicKey(platformWithdrawalPubkey),
      fanout: fanoutPubkey,
      shares: PLATFORM_FEE_POINTS,
    })

    await transactionBuilderGroup([curatorMembership, platformMembership]).sendAndConfirm(umi);
    console.log("Members added")

    //CREATE AUCTION HOUSE
    const metaplex = new Metaplex(connection).use(keypairIdentity(authorityKeypair));
       
    const {auctionHouse} = await metaplex
      .auctionHouse()
      .create({
        sellerFeeBasisPoints: feePoints, 
        authority: authorityKeypair,
        feeWithdrawalDestination: fundingKeypair.publicKey, // withdrawals from the fee account go back to the parent funding account
        treasuryWithdrawalDestination: hydraAccountPubkey, // Hydra Account address

        //ref https://docs.metaplex.com/programs/auction-house/auction-house-settings#require-sign-off
        // requireSignOff: true,
        // canChangeSalePrice: true,
        // hasAuctioneer: true, // to enable auctioneer
        // auctioneerAuthority: authorityKeypair???,
      });
    
    console.log("Auction house created:", auctionHouse.address.toString())

    const minBalance = LAMPORTS_PER_SOL * 0.005
    await fundAccount(fundingKeypair, new PublicKey(auctionHouse.feeAccountAddress), minBalance)
    console.log("Funded auction house")

    const apiResult = await apiClient.post("/curation/create", {
      name: curationName,
      api_key: apiKey,
      curator_fee: curatorFee,
      auction_house_address: auctionHouse.address.toString(),
      private_key_hash: encryptedSecretKey.toString('base64'),
      hydra_name: hydraName,
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

      const refundAmount = balanceLamports - feeCost
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