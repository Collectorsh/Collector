import { Connection } from "@solana/web3.js";

const dev = {
  apiHost: "https://api2.collector.sh",
  host: "http://localhost:3000",
  dao21: "https://api.21dao.xyz",
};

const prod = {
  apiHost: "https://api2.collector.sh",
  host: "https://collector.sh",
  dao21: "https://api.21dao.xyz",
};

const beta = {
  apiHost: "https://api2.collector.sh",
  host: "https://dev.collector.sh",
  dao21: "https://api.21dao.xyz",
};

const config = (function (environment) {
  switch (environment) {
    case "production":
      return prod;
    case "beta":
      return beta;
    default:
      return dev;
  }
})(process.env.NEXT_PUBLIC_REACT_APP_STAGE);

export const auctionHousesArray = [
  {
    name: "default",
    address: "3nAR6ZWZQA1uSNcRy3Qya2ihLU9dhaWKfZavoSiRrXzj",
    authority: "GQbrgxZsRGm3XrrcD9RrwaYHNaLDgvLm4Q16sH7Ybo7r",
    feeAccount: "BumM7hvTGYUvHBSMaDiHqiBPGV8udxhtpZ7CcgFLi2Q8",
    treasuryMint: "So11111111111111111111111111111111111111112",
    treasury: "9rKM3prmcAnjLwwKAp1vHqXds8TRjM9Rz3bqfugkJXRZ",
  },
  {
    name: "holder",
    address: "A5CsrtsB6K8DCfFf86jQhpaLSmrYAy38r89JAy73jGGw",
    authority: "4LwTiowBhmknqsKBYZ7j6W4MpfL6Yvs69HS91NpNUqxT",
    feeAccount: "73JMkUmCszv6mE1XX9onxR1sQzeUxs3YFKaJAWQGx2WH",
    treasuryMint: "So11111111111111111111111111111111111111112",
    treasury: "9MJNcHXwmzLzeuuzcDTh5xAh8bxvLDkhr1seftHkPYaa",
  },
];

export const rpcHost = process.env.NEXT_PUBLIC_RPC;
export const apiHost = config.apiHost;
export const host = config.host;
export const dao21 = config.dao21;
export const loginMessage = "Please sign this message to log-in. ";
export const toPublicKey = "RyvoTTxHVn48GaAA26d8TfBqZcrkVHN4Fyo2LsucTtV";
export const monthlyCharge = 1000000000;
export const yearlyCharge = 8000000000;
export const connection = new Connection(process.env.NEXT_PUBLIC_RPC, {
  httpHeaders: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HELLOMOON_API_KEY}`,
  },
});
