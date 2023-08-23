import axios from "axios";
import apiClient from "../client/apiClient";

async function createCuration({ curationName, apiKey, curatorFee, curatorWithdrawalPubkey }) {
  try {

    const result = await axios.post("/api/curations/create",
      {
        curationName,
        apiKey,
        curatorFee,
        curatorWithdrawalPubkey
      },
      // { timeout: 1000 * 60 * 5, } // 5 minutes
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}

export default createCuration;