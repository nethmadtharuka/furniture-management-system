import api from './api';

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  // Register
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response;
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response;
  },

  // Logout (client-side)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};