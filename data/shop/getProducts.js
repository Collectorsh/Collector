import apiClient from "/data/client/apiClient";

async function getProducts() {
  const products = [
    {
      name: "Collector Dad Hat",
      sol: "0.82",
      usd: "23",
      image:
        "https://media.discordapp.net/attachments/970423472985624668/1026044786458767390/PXL_20221002_081315707.jpg?width=772&height=1029",
    },
  ];
  return products;
}

export default getProducts;
