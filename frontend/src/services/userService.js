import api from '../api/axios';

export const userService = {
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  getRecruiterProfile: async (userId) => {
    const response = await api.get(`/users/recruiter-profile/${userId}`);
    return response.data;
  },

  getAdminUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getAdminDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  getAdminApplications: async (page = 0, size = 10) => {
    const response = await api.get('/admin/applications', { params: { page, size } });
    return response.data;
  },
};
