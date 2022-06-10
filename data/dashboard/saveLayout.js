import apiClient from "/data/client/apiClient";

async function saveLayout(apiKey, tokens) {
  const res = await apiClient
    .post("/visibility_and_order", {
      api_key: apiKey,
      tokens: tokens,
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
