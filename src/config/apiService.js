import api from './api';

/**
 * Tours API Service
 * Provides methods to interact with the Laravel backend API
 */

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
};

// Contact
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

// Example usage in components:
// import { toursAPI, bookingsAPI } from '../config/apiService';
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
