// src/services/authService.js
import api from "./api";

const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "blood_donation_auth_token";

const authService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.tokens) {
        localStorage.setItem(TOKEN_KEY, response.data.tokens.accessToken);
        localStorage.setItem("refresh_token", response.data.tokens.refreshToken);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.tokens) {
        localStorage.setItem(TOKEN_KEY, response.data.tokens.accessToken);
        localStorage.setItem("refresh_token", response.data.tokens.refreshToken);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("refresh_token");
      return { success: true };
    } catch (error) {
      // Clear tokens anyway
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("refresh_token");
      return { success: true };
    }
  },

  /**
   * Verify token and get current user
   */
  verify: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update current user profile. Email is intentionally not editable.
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken) => {
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get stored token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
