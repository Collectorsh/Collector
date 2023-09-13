import apiClient from "../client/apiClient";
export default async function getSalesHistoryByRange({
  apiKey,
  startDate,
  endDate,
}) {
  return apiClient.post("/sales_history/get_by_range", {
    api_key: apiKey,
    start_date: startDate,
    end_date: endDate,
  }).then((res) => res.data)
    .catch((err) => { 
      console.log("Error Getting Sales History By Range: ", err)
    })
}