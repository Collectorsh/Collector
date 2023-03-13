import apiClient from "/data/client/apiClient";

async function getCollection(uuid) {
  const res = await apiClient.post(
    "/products/get_collection",
    { uuid: uuid },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data;
}

export default getCollection;
