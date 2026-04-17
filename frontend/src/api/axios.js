// Placeholder for axios.js
// Full implementation will be added later.
import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is required for the frontend to connect to the MERN backend.");
}

const realApi = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Attach the JWT token if present (real API only).
realApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Remove token if backend says "not authorized".
realApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(err);
  }
);

export default realApi;
