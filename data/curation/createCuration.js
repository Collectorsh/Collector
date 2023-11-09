import axios from "axios";
import apiClient from "../client/apiClient";

async function createCuration({ curationName, apiKey, curatorFee, curatorWithdrawalPubkey }) {
  try {
    const result = await axios.post("/api/curations/createCuration",
      {
        curationName,
        apiKey,
        curatorFee,
        curatorWithdrawalPubkey
      }
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}

export default createCuration;

export async function createPersonalCuration({ curationName, apiKey, curationType, auctionHouseAddress }) {
  try {
    const result = await apiClient.post("/curation/create_personal",
      {
        name: curationName,
        api_key:apiKey,
        curation_type: curationType,
        auction_house_address: auctionHouseAddress
      }
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}