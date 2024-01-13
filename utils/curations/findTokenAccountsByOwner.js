import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { connection } from '../../config/settings';
import { Metaplex } from '@metaplex-foundation/js';

export async function findTokenAccountsByOwner(mintPublicKey, ownerPublicKey) {
  try {
    const accounts = await connection.getTokenAccountsByOwner(ownerPublicKey, { mint: mintPublicKey });
    return accounts.value.map(accountInfo => {
      return accountInfo.pubkey
    });
  } catch (error) {
    console.error("Error in finding token accounts:", error);
  }
}

export function findATA(mintPublicKey, ownerPublicKey, existingMetaplex) {
  const metaplex = Metaplex.make(connection);
  const pdas = metaplex.tokens().pdas();
  return pdas.associatedTokenAccount({ mint: mintPublicKey, owner: ownerPublicKey })


  // vanilla (using metaplex in case they change things)
  return PublicKey.findProgramAddressSync(
    [ownerPublicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )
}