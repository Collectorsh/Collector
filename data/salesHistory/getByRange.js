import apiClient from "../client/apiClient";
export default async function getSalesHistoryByRange({
  apiKey,
  startDate,
  endDate,
  artistUsername,
  collectorUsername,
  curationName,
}) {
  return apiClient.post("/sales_history/get_by_range", {
    api_key: apiKey,
    start_date: startDate,
    end_date: endDate,
    artist_username: artistUsername,
    buyer_username: collectorUsername,
    curation_name: curationName,
  }).then((res) => res.data)
    .catch((err) => { 
      console.log("Error Getting Sales History By Range: ", err)
    })
}