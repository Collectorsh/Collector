import { getMerkleRoot } from "@metaplex-foundation/js";

import whiteList from "../../zmb_allow.json";

export default async function handler(req, res) {
  const mintMax = 1;
  const allowList = whiteList
    .filter((w) => w.max === mintMax)
    .map((w) => w.holder);
  const merkleRoot = getMerkleRoot(allowList);
  return res.status(200).json({ merkleRoot: merkleRoot.toString("hex") });
}
