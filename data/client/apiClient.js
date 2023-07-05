import axios from "axios";
import { apiHost } from "/config/settings";

const apiClient = axios.create({
  baseURL: apiHost,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientLong = axios.create({
  baseURL: apiHost,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 5,
});

export default apiClient;
