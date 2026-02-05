# Tours Mobile App - AI Coding Agent Guide

## Project Overview
React Native (Expo) mobile app for browsing and booking tours with Laravel backend integration. Built with stack navigation + bottom tabs architecture, centralized theming, and AsyncStorage-persisted authentication.

## Architecture & Key Patterns

### Navigation Structure (3 Layers)
- **Root Stack** (see `src/navigation/AppNavigator.js`): Wraps bottom tabs + modal-style screens (Login, Register, Checkout)
- **Bottom Tab Navigator**: Home, Tours (nested stack), Profile, Contact - using Ionicons with focused/outline variants
- **Tours Stack**: ToursList → TourDetails → Booking flow
- Navigation reset pattern used for auth flows: `navigation.reset({ index: 0, routes: [{ name: 'Main' }] })`

### API Integration (see `src/config/api.js`, `src/config/apiService.js`)
- Axios instance with interceptors at `API_BASE_URL = http://localhost:8000/api/v1`
- **Critical**: Change `BASE_URL` for emulators (iOS: localhost, Android: 10.0.2.2, Physical: local IP)
- Organized by domain: `authAPI`, `toursAPI`, `bookingsAPI`, `categoriesAPI`, `contactAPI`
- Images served via `${BASE_URL}/storage/${path}` (tour featured images, not assets)
- All API methods return Laravel response format: `{ success, data, message }`

### Authentication Flow (see `src/contexts/AuthContext.js`)
- Context provides: `{ user, token, loading, login, register, logout, updateProfile }`
- Token persistence via AsyncStorage with keys `@tours_app_token`, `@tours_app_user`
- Axios header auto-injected: `Authorization: Bearer ${token}` via useEffect when token changes
- Login/Register navigate using `navigation.reset()` to prevent back button issues

### Theming System (see `src/constants/theme.js`, `src/constants/colors.js`)
- Centralized design tokens: `theme.colors`, `theme.spacing`, `theme.fontSize`, `theme.borderRadius`, `theme.shadows`
- Use `theme.colors.primary` (not hardcoded hex) for consistency
- Responsive sizing: `theme.dimensions` calculates from `Dimensions.get('window')`
- Shadow objects include iOS/Android platform-specific properties

### Component Patterns

#### Screen Structure
```javascript
// Standard screen template (see HomeScreen.js, ToursScreen.js)
- useState hooks for data, loading, refreshing, errors
- useEffect with fetchData() on mount
- RefreshControl in ScrollView for pull-to-refresh
- LoadingSpinner component during initial load
- Error handling with Alert.alert() or inline error text
```

#### Reusable Components (see `src/components/`)
- **Button**: Gradient primary (LinearGradient), outline, sizes (small/medium/large), disabled state
- **TourCard**: Shows tour image from API (`BASE_URL/storage/${featured_image}`), handles missing images with gradient placeholder, displays featured badge
- **Header**: Transparent overlay with back button (absolute positioning)
- **LoadingSpinner**: Centered ActivityIndicator with theme.colors.primary

#### Form Validation Pattern (see `src/screens/LoginScreen.js`)
```javascript
const [errors, setErrors] = useState({});
const validateForm = () => {
  const newErrors = {};
  if (!email.trim()) newErrors.email = 'Email is required';
  // ... more validation
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
// Display: {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
```

## Development Workflows

### Running the App
```bash
npx expo start          # Start dev server with QR code
npm run ios             # iOS simulator
npm run android         # Android emulator
```

### Backend Connectivity Issues
1. Check BASE_URL in `src/config/api.js` matches your environment
2. iOS Simulator: `http://localhost:8000`
3. Android Emulator: `http://10.0.2.2:8000`
4. Physical device: `http://YOUR_LOCAL_IP:8000` (get via `ipconfig`/`ifconfig`)

### Adding New Screens
1. Create in `src/screens/`, import/export via `src/screens/index.js`
2. Add to Stack.Navigator in `src/navigation/AppNavigator.js`
3. Use `navigation.navigate('ScreenName', { params })` - params accessed via `route.params`

### API Service Extension
Add new endpoints in `src/config/apiService.js` using domain grouping:
```javascript
export const newDomainAPI = {
  getAll: () => api.get('/new-endpoint'),
  getById: (id) => api.get(`/new-endpoint/${id}`),
  create: (data) => api.post('/new-endpoint', data),
};
```

## Project-Specific Conventions

- **No inline styles**: All styles defined in `StyleSheet.create()` at bottom of file
- **Icons**: Ionicons only - use `{name}-outline` for inactive, `{name}` for active/filled
- **Safe areas**: Import SafeAreaView from `react-native-safe-area-context`, not react-native
- **Image sources**: API images use `{ uri: ${BASE_URL}/storage/${path} }`, local assets use `require()`
- **Color naming**: `primary`, `primaryDark`, `primaryLight`, `secondary`, `surface`, `textLight` (see theme.colors)
- **Navigation params**: Use lowercase_underscore for consistency with backend (e.g., `tour_id`, not `tourId`)
- **Async operations**: Always wrap in try-catch, show LoadingSpinner, handle errors with Alert.alert()

## Common Tasks

**Navigate to tour details**: `navigation.navigate('TourDetails', { slug: tour.slug })`  
**Access auth user**: `const { user, token } = useAuth()` (requires component inside AuthProvider)  
**Show loading**: `{loading ? <LoadingSpinner /> : <Content />}`  
**Display tour image**: `<Image source={{ uri: ${BASE_URL}/storage/${tour.featured_image} }} />`  
**Handle API error**: Check `error.response.data` (see api.js interceptor logging)
