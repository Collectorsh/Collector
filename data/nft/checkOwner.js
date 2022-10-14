import apiClient from "/data/client/apiClient";

async function checkOwner(owner) {
  try {
    const res = await apiClient.post("/check/owner", { owner: owner });
    return res.data.token_holder;
  } catch (err) {
    return false;
  }
}

export default checkOwner;
