import api from './api';

/**
 * Tours API Service
 * Provides methods to interact with the Laravel backend API
 */

// Authentication
export const authAPI = {
  register: (name, email, phone, password) =>
    api.post('/register', { name, email, phone, password }),
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    }),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  resetPassword: (email, token, password, passwordConfirmation) =>
    api.post('/reset-password', {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    }),
  getBookings: () => api.get('/user/bookings'),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Tours
export const toursAPI = {
  getAll: (params = {}) => api.get('/tours', { params }),
  getFeatured: (limit = 6) => api.get('/tours/featured', { params: { limit } }),
  getBySlug: (slug) => api.get(`/tours/${slug}`),
};

// Bookings
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
  processPayment: (id, data) => api.post(`/bookings/${id}/payment`, data),
  getTransactions: (id) => api.get(`/bookings/${id}/transactions`),
};

// Contact
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

// Example usage in components:
// import { authAPI, toursAPI, bookingsAPI } from '../config/apiService';
//
// // Register
// const result = await authAPI.register('John Doe', 'john@example.com', '+85512345678', 'password123');
//
// // Login
// const result = await authAPI.login('john@example.com', 'password123');
//
// // Get user bookings
// const bookings = await authAPI.getBookings();
// 
// // Get all tours with filters
// const tours = await toursAPI.getAll({ 
//   category: 'adventure', 
//   sort: 'price_low',
//   per_page: 20 
// });
//
// // Get featured tours
// const featured = await toursAPI.getFeatured(6);
//
// // Get single tour
// const tour = await toursAPI.getBySlug('angkor-wat-temple-complex');
//
// // Create booking
// const booking = await bookingsAPI.create({
//   tour_id: 1,
//   customer_name: 'John Doe',
//   customer_email: 'john@example.com',
//   customer_phone: '+85512345678',
//   booking_date: '2026-02-15',
//   number_of_participants: 2
// });

