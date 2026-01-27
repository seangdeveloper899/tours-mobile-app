# Tours Mobile App

A React Native mobile application for browsing and booking tours, built with Expo. This app mirrors the functionality of the tours-website Laravel project.

## Features

- 🏠 **Home Screen**: Swipeable banner carousel, featured tours, category browsing, and statistics
- 🗺️ **Tours Listing**: Browse all tours with advanced filtering and sorting options
- 📋 **Tour Details**: View comprehensive tour information including itinerary, reviews, and pricing
- 📅 **Booking**: Easy-to-use booking form with price calculation
- 📧 **Contact**: Contact form with FAQ section and social media links
- 🎨 **Beautiful UI**: Modern design with gradients, shadows, and smooth animations

## Tech Stack

- **React Native** with Expo
- **React Navigation** for routing (Stack & Bottom Tabs)
- **Expo Linear Gradient** for gradient effects
- **Ionicons** for icons
- **Axios** for API calls

## Installation

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## Project Structure

```
tours-mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   ├── TourCard.js
│   │   └── index.js
│   ├── constants/           # Theme and colors
│   │   ├── colors.js
│   │   └── theme.js
│   ├── config/              # API configuration
│   │   └── api.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   └── screens/             # App screens
│       ├── HomeScreen.js
│       ├── ToursScreen.js
│       ├── TourDetailsScreen.js
│       ├── BookingScreen.js
│       ├── ContactScreen.js
│       └── index.js
├── App.js                   # Main app component
└── package.json

```

## API Integration

Currently, the app uses mock data for demonstration purposes. To connect to the Laravel backend:

1. Update the `API_BASE_URL` in `src/config/api.js`:
   ```javascript
   const API_BASE_URL = 'http://your-laravel-api-url.com';
   ```

2. Ensure your Laravel API endpoints are set up:
   - `GET /api/tours` - List all tours
   - `GET /api/tours/{slug}` - Get tour details
   - `GET /api/categories` - List categories
   - `POST /api/bookings` - Create booking
   - `POST /api/contact` - Send contact message

## Screens

### Home Screen
- Hero banner carousel with 3 slides
- Statistics counter (travelers, tours, guides, experience)
- Why Choose Us section
- Category grid
- Featured tours

### Tours Screen
- Search functionality
- Filter by category, price range, duration
- Sort options (featured, price, rating)
- Tours grid with cards

### Tour Details Screen
- Hero image
- Tour information (duration, group size, difficulty)
- Description and itinerary
- Included/excluded items
- Customer reviews
- Book now button

### Booking Screen
- Tour summary
- Booking form (name, email, phone, date)
- Number of people selector
- Special requests field
- Price calculation
- Confirmation

### Contact Screen
- Contact information cards
- Contact form
- Social media links
- FAQ section

## Color Scheme

The app uses a green-themed color palette matching the website:
- Primary: `#059669` (emerald-700)
- Secondary: `#fbbf24` (yellow-400)
- Success: `#10b981` (green-500)
- Error: `#ef4444` (red-500)

## Development Notes

- All screens use mock data currently
- Replace mock data with actual API calls when backend is ready
- The app follows the design and UX of the tours-website project
- Responsive design works on all screen sizes
- Uses React Navigation for smooth transitions

## Future Enhancements

- [ ] Connect to Laravel API
- [ ] Add user authentication
- [ ] Implement image galleries
- [ ] Add payment gateway integration
- [ ] Push notifications for bookings
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode theme

## License

This project is part of the Tours Website system.
