import { Metaplex, keypairIdentity, Hydra, sol } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import crypto from 'crypto' 
import fs from "fs"
import { formatRSAPrivateKey } from "../../../utils/formatRSA";

import { mplHydra, findFanoutNativeAccountPda, findFanoutPda, distributeWallet, findFanoutMembershipVoucherPda } from "@metaplex-foundation/mpl-hydra";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { transactionBuilderGroup, keypairIdentity as umiKeypairIdentity } from "@metaplex-foundation/umi";
import { rpcHost } from "../../../config/settings";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { platformWithdrawalPubkey } from "./create";

export default async function handler(req, res) {
  const { privateKeyHash, hydraName, curatorWithdrawalPubkey, auctionHouseAddress } = req.body;
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

    const balance = await connection.getBalance(auctionHouse.treasuryAccountAddress)

    if (balance <= 0) throw new Error("No funds available to withdraw")

    await metaplex
      .auctionHouse()
      .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: sol(balance / LAMPORTS_PER_SOL),
      });
    
    console.log(`Withdrawn ${ balance / LAMPORTS_PER_SOL} SOL from Auction House Treasury`)

    //Distribute from Hydra
    const umiAuthorityIdentity = umiKeypairIdentity(fromWeb3JsKeypair(authorityKeypair), true)
    const member = curatorWithdrawalPubkey
    const umi = createUmi(rpcHost).use(umiAuthorityIdentity).use(mplHydra());
    const [fanoutPubkey] = findFanoutPda(umi, { name: hydraName });
    const [hydraAccountPubkey] = findFanoutNativeAccountPda(umi, { fanout: fanoutPubkey });
    
    // const hydra = await fetchFanout(umi, fanoutPubkey);
    // console.log("🚀 ~ file: withdraw.js:59 ~ handler ~ hydra:", hydra)

    const curatorMembershipVoucher = findFanoutMembershipVoucherPda(umi, {
      fanout: fanoutPubkey,
      member,
    })

    const mintAddress = "So11111111111111111111111111111111111111112"
    const curatorMembership = distributeWallet(umi, {
      member,
      membershipVoucher: curatorMembershipVoucher,
      fanout: fanoutPubkey,
      holdingAccount: hydraAccountPubkey,
      // Filler, not actually used, just needs to be a SPL address (to my knowledge)
      fanoutForMint: mintAddress,
      fanoutForMintMembershipVoucher: mintAddress,
      fanoutMint: mintAddress,
      fanoutMintMemberTokenAccount: mintAddress,
    })

    const platformMember = platformWithdrawalPubkey
    const platformMembershipVoucher = findFanoutMembershipVoucherPda(umi, {
      fanout: fanoutPubkey,
      member: platformMember,
    })

    const platformMembership = distributeWallet(umi, {
      member: platformMember,
      membershipVoucher: platformMembershipVoucher,
      fanout: fanoutPubkey,
      holdingAccount: hydraAccountPubkey,
       // Filler, not actually used, just needs to be a SPL address (to my knowledge)
      fanoutForMint: mintAddress,
      fanoutForMintMembershipVoucher:mintAddress,
      fanoutMint:mintAddress,
      fanoutMintMemberTokenAccount:mintAddress,
    })
    await transactionBuilderGroup([curatorMembership, platformMembership]).sendAndConfirm(umi);
    console.log("Members paid")

    return res.status(200).json("success");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}