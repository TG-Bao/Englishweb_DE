import axios from "axios";
import { getToken } from "../utils/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api"
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`; // OLD
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Add response interceptor for debugging and 401 handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request detected. User may need to log in again.");
    }
    return Promise.reject(error);
  }
);
