import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button } from '../components';
import theme from '../constants/theme';
import { bookingsAPI } from '../config/apiService';
import { useAuth } from '../contexts/AuthContext';

const BookingScreen = ({ route, navigation }) => {
  const { tour } = route.params;
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    numberOfPeople: '1',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  // Auto-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Submit booking to API (token will be automatically included if authenticated)
      const response = await bookingsAPI.create({
        tour_id: tour.id,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        booking_date: formData.bookingDate,
        number_of_participants: parseInt(formData.numberOfPeople),
        special_requests: formData.specialRequests || null,
      });

      setLoading(false);

      if (response.success) {
        // Navigate to checkout screen with booking details
        navigation.navigate('Checkout', { booking: response.data });
      }
    } catch (error) {
      setLoading(false);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to submit booking. Please check your connection and try again.');
      }
    }
  };

  const totalPrice = tour.price * parseInt(formData.numberOfPeople || '1');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Book Your Tour"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Tour Summary */}
        <View style={styles.tourSummary}>
          <Text style={styles.summaryTitle}>Tour Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tour:</Text>
            <Text style={styles.summaryValue}>{tour.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{tour.duration_days} day(s)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per person:</Text>
            <Text style={styles.summaryPrice}>${tour.price}</Text>
          </View>
        </View>

        {/* Guest User Message */}
        {!isAuthenticated && (
          <View style={styles.guestMessage}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.guestMessageText}>
              Sign in to automatically fill your details and track your bookings.{' '}
              <Text
                style={styles.guestMessageLink}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        )}

        {/* Booking Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Booking Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="person" size={16} color={theme.colors.primary} /> Full Name *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.customerName}
              onChangeText={(text) => handleInputChange('customerName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="mail" size={16} color={theme.colors.primary} /> Email Address *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={formData.customerEmail}
              onChangeText={(text) => handleInputChange('customerEmail', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="call" size={16} color={theme.colors.primary} /> Phone Number *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              value={formData.customerPhone}
              onChangeText={(text) => handleInputChange('customerPhone', text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="calendar" size={16} color={theme.colors.primary} /> Preferred Tour Date *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={formData.bookingDate}
              onChangeText={(text) => handleInputChange('bookingDate', text)}
            />
            <Text style={styles.hint}>Format: YYYY-MM-DD (e.g., 2026-02-15)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="people" size={16} color={theme.colors.primary} /> Number of People *
            </Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => {
                  const current = parseInt(formData.numberOfPeople) || 1;
                  if (current > 1) {
                    handleInputChange('numberOfPeople', (current - 1).toString());
                  }
                }}
              >
                <Ionicons name="remove" size={24} color={theme.colors.white} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{formData.numberOfPeople}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => {
                  const current = parseInt(formData.numberOfPeople) || 1;
                  if (current < tour.max_participants) {
                    handleInputChange('numberOfPeople', (current + 1).toString());
                  }
                }}
              >
                <Ionicons name="add" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Maximum {tour.max_participants} people</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} color={theme.colors.primary} /> Special Requests
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChangeText={(text) => handleInputChange('specialRequests', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.priceSummaryTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${tour.price} x {formData.numberOfPeople} person(s)
            </Text>
            <Text style={styles.priceAmount}>${totalPrice}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${totalPrice}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Processing...' : 'Confirm Booking'}
            onPress={handleSubmit}
            disabled={loading}
            icon={<Ionicons name="checkmark-circle" size={20} color={theme.colors.white} />}
          />
        </View>

        <Text style={styles.disclaimer}>
          * By confirming this booking, you agree to our terms and conditions. 
          You will receive a confirmation email shortly.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  tourSummary: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  summaryTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  summaryPrice: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  guestMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  guestMessageText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  guestMessageLink: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  formTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  counterButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    minWidth: 50,
    textAlign: 'center',
  },
  priceSummary: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  priceSummaryTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  priceAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  totalAmount: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  buttonContainer: {
    marginBottom: theme.spacing.md,
  },
  disclaimer: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default BookingScreen;
