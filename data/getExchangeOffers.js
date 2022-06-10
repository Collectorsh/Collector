import axios from "axios";
import { roundToTwo } from "/utils/roundToTwo";

async function getExchangeOffers(publicKeys) {
  var offers = [];
  for (const publicKey of publicKeys) {
    try {
      let res = await axios.post(
        "https://api.exchange.art/v1/public/offers/_get",
        {
          query: { madeTo: publicKey },
        },
        {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      );
      for (const result of res.data) {
        for (const offer of result.offers) {
          let off = {};
          off.mint = offer.keys.mint;
          off.amount = roundToTwo(offer.data.buyerAmount / 1000000000);
          off.source = "exchange";
          offers.push(off);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return offers;
}

export default getExchangeOffers;
