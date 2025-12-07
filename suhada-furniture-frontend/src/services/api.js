import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL - your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Return the data directly if it has the standard format
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Something went wrong';
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('Access denied');
      } else if (error.response.status === 400) {
        // Bad request - show validation errors
        const errors = error.response.data?.data;
        if (errors && typeof errors === 'object') {
          // Multiple validation errors
          Object.values(errors).forEach(err => toast.error(err));
        } else {
          toast.error(message);
        }
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Cannot connect to server. Please check your connection.');
    } else {
      toast.error('An error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;