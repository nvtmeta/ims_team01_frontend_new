import axios from "axios";
import { getCookie } from "cookies-next";

export let baseURL = "http://localhost:8888/api/";
export const instanceAxios = axios.create({
  baseURL: `${baseURL}`,
});

// Add an interceptor to attach the token from cookies to each request
instanceAxios.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = getCookie("token");
    if (token) {
      // Attach the token to the request header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
