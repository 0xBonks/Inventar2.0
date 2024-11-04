import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
};

export const inventory = {
  getAll: () => api.get('/inventory'),
  create: (item) => api.post('/inventory', item),
  update: (id, item) => api.patch(`/inventory/${id}`, item),
  delete: (id) => api.delete(`/inventory/${id}`)
};

export const reports = {
  getStatus: () => api.get('/reports/status'),
  getLowStock: () => api.get('/reports/low-stock')
};

export default api; 