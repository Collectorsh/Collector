import { PublicKey } from "@metaplex-foundation/js"

export const getMasterEditionSupply = async (mint, metaplex) => {
  const metadata = await metaplex.nfts().findByMint({
    mintAddress: new PublicKey(mint),
  })

  const supply = metadata?.edition?.supply
  return supply ? Number(supply.toString()) : undefined
}