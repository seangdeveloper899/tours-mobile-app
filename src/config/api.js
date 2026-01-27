import axios from 'axios';

// Base URL configuration
// For iOS Simulator: http://localhost:8000
// For Android Emulator: http://10.0.2.2:8000
// For Physical Device: http://YOUR_LOCAL_IP:8000
export const BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
