import apiClient from "/data/client/apiClient";

async function getProducts(uuid) {
  const res = await apiClient.post(
    "/products/products",
    { uuid: uuid },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data.products;
}

export default getProducts;
