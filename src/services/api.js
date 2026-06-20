// src/services/api.js
import axios from "axios";

const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "blood_donation_auth_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

          const { token } = response.data;
          localStorage.setItem(TOKEN_KEY, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
