import { Connection } from "@solana/web3.js";
import { baseCloudImageUrl } from "../utils/cloudinary/baseCldUrl";

const dev = {
  apiHost: "http://localhost:3001",
  nodeApiHost: "http://localhost:3002",
  host: "http://localhost:3000",
  dao21: "https://api.21dao.xyz",
};

const production = {
  apiHost: "https://collector.sh/collector-api",
  nodeApiHost: "https://collector.sh/collector-node-api",
  host: "https://collector.sh",
  dao21: "https://api.21dao.xyz",
}; 

const test = {
  apiHost: "https://collector-testing-kvak9.ondigitalocean.app/collector-api",
  nodeApiHost: "https://collector-testing-kvak9.ondigitalocean.app/collector-node-api", 
  host: "https://collector-testing-kvak9.ondigitalocean.app",
  dao21: "https://api.21dao.xyz",
};

const config = (function(environment) {
  switch (environment) {
    case "production":
      return production;
    case "test":
      return test;
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
export const nodeApiHost = config.nodeApiHost;
export const host = config.host;
export const dao21 = config.dao21;
export const loginMessage = "Welcome to Collector! Please sign this message to log-in. ";
// export const loginMessage = "Welcome to Collector!\n\n Dive into a world where you can collect, curate, and discover beautiful art.\n\n By signing or approving this message, you confirm the ownership of this wallet address.\n\n This action is completely free and you will not be charged. ";
// export const loginMessage = `
//   Welcome to Collector!

//   Dive into a world where you can collect, curate, and discover beautiful art. By signing or approving this message, you confirm the ownership of this wallet address. This action is completely free and you won't be charged.
//   Please note, your use of Collector is governed by our Terms of Service and Privacy Policy.

//   Happy Collecting 🖼

//   Terms (https://collector.sh/terms)
//   Privacy Policy (https://collector.sh/privacy)
// `
export const toPublicKey = "RyvoTTxHVn48GaAA26d8TfBqZcrkVHN4Fyo2LsucTtV";
export const monthlyCharge = 1000000000;
export const yearlyCharge = 8000000000;
export const connection = new Connection(process.env.NEXT_PUBLIC_RPC)
export const adminIDs = [
  720, //Nate (username: n8solomon)
  5421, //Scott (username: EV3)
]

export const metaPreviewImage = baseCloudImageUrl("global/Collector_Hero_btrh4t")
export const metaDescription = "Collect, Curate, and Discover Beautiful Art" 

//HELLO MOON rpc deprecated
  // ,{
  //   httpHeaders: {
  //     Authorization: `Bearer ${ process.env.NEXT_PUBLIC_HELLOMOON_API_KEY }`, 
  //   },
  // }
// );
