import axios from "axios";

const api = axios.create({
  baseURL: "https://codebase-qa-ozcn.onrender.com/api",
});

// Interceptor to remove Content-Type for FormData (allows browser to set correct boundary)
api.interceptors.request.use((config) => {
  console.log("[API] Request:", config.method.toUpperCase(), config.url, "Full URL:", config.baseURL + config.url);
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    console.log("[API] FormData request - Content-Type removed for multipart");
  }
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("[API] Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.log("[API] Error:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;