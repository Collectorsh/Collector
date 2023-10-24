import axios from "axios";
import apiClient from "../client/apiClient";

async function withdrawFromTreasury({ privateKeyHash, curation }) {
  try {

    //TODO just get the full curation in the API handler (user either curator api_key or admin api_key + curation id )
    const result = await axios.post("/api/curations/withdraw",
      {
        privateKeyHash,
        curatorWithdrawalPubkey: curation.payout_address,
        auctionHouseAddress: curation.auction_house_address,
        curatorFee: curation.curator_fee,
      },
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}

export default withdrawFromTreasury;