# Tours Mobile App

A complete React Native (Expo) mobile application for browsing, booking, and managing tours. Built step-by-step with realistic commits and a modular folder structure.

## Features
- Home screen with banner carousel, statistics, categories, and featured tours
- Tours listing with search and filters
- Detailed tour view with itinerary, reviews, and booking CTA
- Booking form with validation
- Contact page with FAQ
- Bottom tab and stack navigation
- Centralized theme and color system
- Mock API integration for tours and details

## Folder Structure
```
├── App.js
├── app.json
├── package.json
├── README.md
├── assets/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   ├── TourCard.js
│   ├── config/
│   │   ├── api.js
│   │   ├── apiService.js
│   ├── constants/
│   │   ├── colors.js
│   │   ├── theme.js
│   ├── navigation/
│   │   ├── AppNavigator.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── ToursScreen.js
│   │   ├── TourDetailsScreen.js
│   │   ├── BookingScreen.js
│   │   ├── ContactScreen.js
```

## Getting Started
1. Install [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/)
2. Clone the repository:
   ```sh
   git clone https://github.com/seangdeveloper899/tours-mobile-app.git
   cd tours-mobile-app
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the Expo development server:
   ```sh
   npx expo start
   ```
5. Scan the QR code with Expo Go or run on an emulator.

## API Integration
- All API calls use mock data via `src/config/apiService.js`.
- To connect to a real backend, update `API_BASE_URL` in `src/config/api.js` and implement real fetch logic in `apiService.js`.

## Development Workflow
- Built step-by-step, with daily commits for each major feature.
- Modular, maintainable codebase for easy extension.

## License
MIT
