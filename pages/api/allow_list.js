import { getMerkleRoot } from "@metaplex-foundation/js";

export default async function handler(req, res) {
  const allowList = ["2eBBNzw7DeWuYfWhPVGanm7VyYogiWKjSRcAHhcDFSMd"];
  const merkleRoot = getMerkleRoot(allowList);
  return res.status(200).json({ merkleRoot: merkleRoot.toString("hex") });
}
