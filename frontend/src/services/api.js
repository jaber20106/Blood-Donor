import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const donorService = {
  getEligibleDonors: () => api.get('/donors/eligible'),
  getProfile: () => api.get('/donors/profile'),
  updateProfile: (data) => api.put('/donors/profile', data),
  updateEligibility: (id, data) => api.patch(`/donors/${id}`, data),
  checkEligibility: (id) => api.get(`/donors/${id}/eligibility`),
};

export const donationService = {
  getMyDonations: () => api.get('/donations/my'),
  createDonation: (data) => api.post('/donations', data),
  getAllDonations: () => api.get('/donations'),
};

export const clientService = {
  searchDonors: (params) => api.get('/client/search', { params }),
  contactDonor: (donorId) => api.post(`/client/contact/${donorId}`),
};

export const statisticsService = {
  getPublicStats: () => api.get('/statistics/public'),
  getDonationsPerMonth: () => api.get('/statistics/donations-per-month'),
  getNewUsersPerMonth: () => api.get('/statistics/new-users-per-month'),
  getActiveDistricts: () => api.get('/statistics/active-districts'),
};

export const roleService = {
  getRoles: () => api.get('/roles'),
  getRole: (id) => api.get(`/roles/${id}`),
  createRole: (data) => api.post('/roles', data),
  updateRole: (id, data) => api.put(`/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/roles/${id}`),
};

export const permissionService = {
  getPermissions: () => api.get('/permissions'),
};

export default api;
