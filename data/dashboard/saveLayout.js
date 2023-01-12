import apiClient from "/data/client/apiClient";

async function saveLayout(apiKey, tokens, columns) {
  const res = await apiClient
    .post("/visibility_and_order", {
      api_key: apiKey,
      tokens: tokens,
      columns: columns,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  return res;
}

export default saveLayout;
