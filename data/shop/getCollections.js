import apiClient from "/data/client/apiClient";

async function getCollections() {
  const res = await apiClient.post(
    "/products/collections",
    {},
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data.collections;
}

export default getCollections;
