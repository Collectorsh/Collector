import axios from "axios";
import { apiHost } from "/config/settings";
import { nodeApiHost } from "../../config/settings";

const apiClient = axios.create({
  baseURL: apiHost,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiNodeClient = axios.create({
  baseURL: nodeApiHost
});

export default apiClient;
