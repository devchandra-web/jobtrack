import api from '../api/axios';

export const applicationService = {
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications/apply', applicationData);
    return response.data;
  },

  getCandidateApplications: async (page = 0, size = 10) => {
    const response = await api.get('/applications/candidate/my-applications', { params: { page, size } });
    return response.data;
  },

  getRecruiterApplications: async (params = {}) => {
    const response = await api.get('/applications/recruiter/job-applications', { params });
    return response.data;
  },

  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  },
};
