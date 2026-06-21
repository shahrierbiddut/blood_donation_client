import api from "./api";

const donationService = {
  getAll: async ({ bloodGroup = "", district = "", upazila = "", page = 1 } = {}) => {
    const params = new URLSearchParams({ page });
    if (bloodGroup && bloodGroup !== "All") params.append("bloodGroup", bloodGroup);
    if (district && district !== "All") params.append("district", district);
    if (upazila && upazila !== "All") params.append("upazila", upazila);
    const response = await api.get(`/donations?${params.toString()}`);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  getMy: async () => {
    const response = await api.get("/donations/user/my");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/donations/user/stats");
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post("/donations", payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/donations/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  }
};

export default donationService;
