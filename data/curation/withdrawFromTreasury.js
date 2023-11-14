import axios from "axios";
import apiClient from "../client/apiClient";
import { PLATFORM_AUCTION_HOUSE_1_ADDRESS } from "../../config/settings";

async function withdrawFromTreasury({ privateKeyHash, curation }) {
  try {

    console.log("🚀 ~ file: withdrawFromTreasury.js:13 ~ withdrawFromTreasury ~ curation.payout_address:", curation.payout_address)
 
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

export async function withdrawFromPlatformTreasury() {
  try {
    const auctionHouseAddress = PLATFORM_AUCTION_HOUSE_1_ADDRESS;
    const keyHashName = "platform_auction_house_1"
    const result = await axios.post("/api/curations/platformWithdraw",
      {
        auctionHouseAddress,
        keyHashName
      },
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}