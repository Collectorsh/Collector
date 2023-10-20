import axios from "axios";

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