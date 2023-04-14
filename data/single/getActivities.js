import axios from "axios";
import getOwnerCollectorName from "/data/getOwnerCollectorName";

async function getActivities(mint) {
  let res = await axios.post(
    "https://rest-api.hellomoon.io/v0/nft/sales/secondary",
    { nftMint: mint },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HELLOMOON_API_KEY}`,
      },
    }
  );
  if (res.data && res.data.data && res.data.data.length > 0) {
    for (const r of res.data.data) {
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
