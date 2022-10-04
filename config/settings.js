const dev = {
  apiHost: "http://localhost:3001",
  host: "http://localhost:3000",
  dao21: "https://api.21dao.xyz",
};

const prod = {
  apiHost: "https://api.collector.sh",
  host: "https://collector.sh",
  dao21: "https://api.21dao.xyz",
};

const beta = {
  apiHost: "https://api.collector.sh",
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

export const rpcHost = process.env.NEXT_PUBLIC_RPC;
export const apiHost = config.apiHost;
export const host = config.host;
export const dao21 = config.dao21;
export const loginMessage = "Please sign this message to log-in. ";
export const toPublicKey = "RyvoTTxHVn48GaAA26d8TfBqZcrkVHN4Fyo2LsucTtV";
export const monthlyCharge = 1000000000;
export const yearlyCharge = 8000000000;
