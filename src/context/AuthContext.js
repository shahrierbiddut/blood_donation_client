// src/context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check if user is authenticated on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.verify();
          if (response.success) {
            setUser(response.user);
          } else {
            // Token is invalid
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Register user
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
