import axios from "axios";
const rawApiBaseUrl = import.meta.env.VITE_API_URL;

if (!rawApiBaseUrl) {
  throw new Error("VITE_API_URL is required for the frontend to connect to the MERN backend.");
}

function normalizeBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

function normalizeApiPath(value) {
  if (!value || /^https?:\/\//i.test(value)) {
    return value;
  }

  const withLeadingSlash = String(value).startsWith("/") ? String(value) : `/${value}`;
  return withLeadingSlash.startsWith("/api") ? withLeadingSlash : `/api${withLeadingSlash}`;
}

const realApi = axios.create({
  baseURL: normalizeBaseUrl(rawApiBaseUrl),
  withCredentials: true,
});

realApi.interceptors.request.use((config) => {
  config.url = normalizeApiPath(config.url);
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
