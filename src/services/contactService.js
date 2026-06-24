"use client";

import api from "./api";

const contactService = {
  // Create a new contact message (public)
  create: async (payload) => {
    const response = await api.post("/contacts", payload);
    return response.data;
  },

  // Get all contact messages (admin only)
  getAll: async ({ page = 1, limit = 10, status = "all", search = "" } = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      search
    });
    const response = await api.get(`/contacts/admin/all?${params.toString()}`);
    return response.data;
  },

  // Get single contact message (admin only)
  getById: async (id) => {
    const response = await api.get(`/contacts/admin/${id}`);
    return response.data;
  },

  // Update contact status and add reply (admin only)
  updateStatus: async (id, payload) => {
    const response = await api.put(`/contacts/admin/${id}/status`, payload);
    return response.data;
  },

  // Delete contact message (admin only)
  delete: async (id) => {
    const response = await api.delete(`/contacts/admin/${id}`);
    return response.data;
  }
};

export default contactService;
