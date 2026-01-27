# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)

## Getting Started

### 1. Install Dependencies
```bash
cd tours-mobile-app
npm install
```

### 2. Start the Development Server
```bash
npm start
```

This will start the Expo development server and display a QR code in your terminal.

### 3. Run on Your Device

#### For iOS:
1. Install "Expo Go" from the App Store
2. Open the Camera app
3. Scan the QR code from the terminal
4. The app will open in Expo Go

#### For Android:
1. Install "Expo Go" from the Google Play Store
2. Open Expo Go app
3. Scan the QR code from the terminal
4. The app will load automatically

#### For Web:
Press `w` in the terminal or visit http://localhost:8081 in your browser

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## API Configuration

To connect to your Laravel backend:

1. Open `src/config/api.js`
2. Update the `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = 'http://YOUR_LARAVEL_API_URL';
   ```
3. For local development, use:
   - iOS Simulator: `http://localhost:8000`
   - Android Emulator: `http://10.0.2.2:8000`
   - Physical Device: `http://YOUR_COMPUTER_IP:8000`

## Features to Test

1. **Home Screen**
   - Swipe through banner carousel
   - Browse categories
   - View featured tours

2. **Tours Screen**
   - Search tours
   - Filter by category and price
   - Sort tours

3. **Tour Details**
   - View tour information
   - Read reviews
   - Check included/excluded items

4. **Booking**
   - Fill booking form
   - Adjust number of people
   - See price calculation

5. **Contact**
   - Fill contact form
   - View contact information
   - Check FAQ section

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### iOS Build Issues
```bash
cd ios && pod install && cd ..
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

### Port Already in Use
```bash
npm start -- --port 8082
```

## Next Steps

1. Connect to your Laravel API
2. Test all functionality with real data
3. Customize colors and branding
4. Add app icons and splash screens
5. Test on multiple devices
6. Prepare for deployment

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
