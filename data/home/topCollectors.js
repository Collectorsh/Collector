import axios from "axios";
import { dao21 } from "/config/settings";

async function topCollectors() {
  try {
    const response = await axios.post(dao21 + "/auctions/buyers", {
      marketplace: ["exchange", "holaplex", "formfunction"],
      limit: 10,
      days: 1,
    });
    let collectors = response.data.auctions;
    for (const collector of collectors) {
      try {
        let res = await axios.post(dao21 + "/auctions/last", {
          buyer: collector.highest_bidder,
        });
        collector.last = res.data.auction;
      } catch (err) {
        console.log(err);
      }
    }
    return collectors;
  } catch (error) {
    console.log(error);
  }
}

export default topCollectors;
