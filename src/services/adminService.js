import api from "./api";

/**
 * Admin User Management Service
 * Handles all admin API calls for user management
 */

const ADMIN_API = "/admin";

const toServiceError = (error) => {
  const data = error?.response?.data;
  if (data?.message) return data;
  return { success: false, message: error?.message || "Something went wrong", data: null };
};

export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_API}/users`, { params });
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`${ADMIN_API}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`${ADMIN_API}/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`${ADMIN_API}/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`${ADMIN_API}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw toServiceError(error);
  }
};