import axios from 'axios';

// Base URL configuration
// For iOS Simulator: http://localhost:8000
// For Android Emulator: http://10.0.2.2:8000 (or use local IP if not working)
// For Physical Device: http://YOUR_LOCAL_IP:8000
// Using local IP works for both Android Emulator and Physical Devices
export const BASE_URL = 'http://192.168.1.89:8000';
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
    // Log the request for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    // Return the data directly if it exists
    return response.data;
  },
  error => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
