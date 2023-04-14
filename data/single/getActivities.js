import axios from "axios";
import apiClient from "/data/client/apiClient";
import getOwnerCollectorName from "/data/getOwnerCollectorName";

async function getActivities(mint) {
  let res = await apiClient.post("/sales/by_mint", { mint: mint });

  if (res.data && res.data.length > 0) {
    for (const r of res.data) {
      let resp = await getOwnerCollectorName(r.buyer);
      let buyer = r.buyer;
      r.buyer = {};
      if (resp.status === "success") {
        r.buyer.wallet = buyer;
        r.buyer.username = resp.username;
        r.buyer.twitter_screen_name = resp.twitter_screen_name;
      }
    }
  }
  return res.data;
}

export default getActivities;
