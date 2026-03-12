import axios from "axios";
import Cookies from "js-cookie";
import store from "../store/store";

export const API_BASE_URL = "https://oddsapi.247idhub.com";
export const URB_API_BASE_URL = "https://api.urb99.com";

const withAuthToken = (config) => {
  const state = store.getState();
  const reduxToken = state?.auth?.accessToken;
  const cookieToken = Cookies.get("accessToken");
  const token = reduxToken || cookieToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    Cookies.remove("accessToken", { path: "/" });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const urbApiClient = axios.create({
  baseURL: URB_API_BASE_URL,
});

apiClient.interceptors.request.use(withAuthToken, Promise.reject);
urbApiClient.interceptors.request.use(withAuthToken, Promise.reject);

apiClient.interceptors.response.use((response) => response, handleAuthError);
urbApiClient.interceptors.response.use((response) => response, handleAuthError);

export default apiClient;
