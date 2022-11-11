import apiClient from "/data/client/apiClient";

async function getProduct(uuid) {
  const res = await apiClient.post(
    "/products/get_product",
    { uuid: uuid },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data;
}

export default getProduct;
