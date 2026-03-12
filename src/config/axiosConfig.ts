import axios from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "https://api.urb99.com";

// Set base URL for all axios requests
axios.defaults.baseURL = API_BASE_URL;

// Add a request interceptor to include the token
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("accessToken");
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
