import apiClient from "/data/client/apiClient";

async function getEstimatedValue(token) {
  const res = await apiClient.post(
    "/estimate/price",
    { mint: token.mint },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );

  if (res.data.status === "success") token.estimate = res.data.estimate;

  return token;
}

export default getEstimatedValue;
