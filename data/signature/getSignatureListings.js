import apiClient from "/data/client/apiClient";

async function getSignatureListings() {
  try {
    const res = await apiClient.post("/signature/listings", {});
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getSignatureListings;
