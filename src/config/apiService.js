// src/config/apiService.js

import API_BASE_URL from './api';

export async function fetchTours() {
  // Mock data for now
  return [
    {
      id: 1,
      title: 'Mountain Adventure',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      price: 199,
      rating: 4.9,
    },
    {
      id: 2,
      title: 'City Explorer',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      price: 149,
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Beach Paradise',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
      price: 249,
      rating: 4.8,
    },
  ];
}

export async function fetchTourDetails(id) {
  // Mock data for now
  return {
    id,
    title: 'Mountain Adventure',
    itinerary: [
      'Day 1: Arrival and orientation',
      'Day 2: Hiking and sightseeing',
      'Day 3: Local culture tour',
      'Day 4: Departure',
    ],
    reviews: [
      { user: 'Alice', comment: 'Amazing experience!', rating: 5 },
      { user: 'Bob', comment: 'Loved every moment.', rating: 4.5 },
    ],
  };
}
