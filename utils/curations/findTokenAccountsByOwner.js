const { PublicKey } = require('@solana/web3.js');
const { connection } = require('../../config/settings');

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