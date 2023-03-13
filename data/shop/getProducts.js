import apiClient from "/data/client/apiClient";

async function getProducts() {
  const res = await apiClient.post(
    "/products/get",
    {},
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data.products;
}

export default getProducts;