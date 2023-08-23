import axios from "axios";
import apiClient from "../client/apiClient";

async function withdrawFromTreasury({ privateKeyHash, curation }) {
  try {
    const result = await axios.post("/api/curations/withdraw",
      {
        privateKeyHash,
        hydraName: curation.hydra_name,
        curatorWithdrawalPubkey: curation.payout_address,
        auctionHouseAddress: curation.auction_house_address
      },
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}

export default withdrawFromTreasury;