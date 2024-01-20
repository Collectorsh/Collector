import { PublicKey } from '@solana/web3.js';
import { connection } from '../../config/settings';

export const getNftOwner = async (mint) => {
  const mintKey = new PublicKey(mint);
  const largestAccounts = await connection.getTokenLargestAccounts(mintKey)
  const largestAccountInfo = await connection.getParsedAccountInfo(
    largestAccounts.value[0].address  //first element is the largest account, assumed with 1 
  );
  return largestAccountInfo.value.data.parsed.info.owner;
}