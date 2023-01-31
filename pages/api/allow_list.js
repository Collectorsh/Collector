import { getMerkleRoot } from "@metaplex-foundation/js";

import whiteList from "../../zmb_allow.json";

export default async function handler(req, res) {
  console.log(req);
  try {
    const roots = [];
    for (let i = 1; i < 10; i++) {
      const allowList = whiteList
        .filter((w) => w.max === i)
        .map((w) => w.holder);
      const merkleRoot = getMerkleRoot(allowList);
      roots.push({ id: i, hash: merkleRoot.toString("hex") });
    }
    return res.status(200).json(roots);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
