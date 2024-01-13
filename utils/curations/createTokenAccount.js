import { AccountLayout, TOKEN_PROGRAM_ID, createInitializeAccountInstruction } from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, Transaction  } from "@solana/web3.js";


//Don't use this for minting, use createAssociatedTokenAccountInstruction() instead
export const createTokenAccount = async ({
  payer,
  mint,
  connection,
  owner,
}) => {
  const tokenAccount = Keypair.generate();

  const createTokenTx = new Transaction();

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);

  createTokenTx.add(
    SystemProgram.createAccount({
      fromPubkey: payer, //should be nft owner
      newAccountPubkey: tokenAccount.publicKey,
      lamports: accountRentExempt,
      space: AccountLayout.span,
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    })
  );

  createTokenTx.add(
    createInitializeAccountInstruction(
      tokenAccount.publicKey,
      mint,
      owner ?? payer,
    )
  );
  return {
    tokenAccount,
    createTokenTx,
  };
};