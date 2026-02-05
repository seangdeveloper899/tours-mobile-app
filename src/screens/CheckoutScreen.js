import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI } from '../config/apiService';
import theme from '../constants/theme';
import { Button, LoadingSpinner } from '../components';

const CheckoutScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [selectedPaymentType, setSelectedPaymentType] = useState('full');

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: 'card-outline' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'business-outline' },
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
  ];

  const depositAmount = booking.total_price * 0.3; // 30% deposit
  const remainingBalance = booking.total_price - depositAmount;

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await bookingsAPI.processPayment(booking.id, {
        payment_method: selectedPaymentMethod,
        payment_type: selectedPaymentType,
      });

      setLoading(false);

      if (response.success) {
        const amountPaid = response.data.amount_paid;
        const remaining = response.data.remaining_balance;

        Alert.alert(
          'Payment Successful!',
          `Payment of $${amountPaid} has been processed successfully.\n${
            remaining > 0 ? `Remaining balance: $${remaining}` : 'Booking fully paid!'
          }`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (isAuthenticated) {
                  navigation.navigate('Main', { screen: 'Profile' });
                } else {
                  navigation.navigate('Home');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'Failed to process payment. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Processing payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tour:</Text>
            <Text style={styles.summaryValue}>{booking.tour?.title || 'Tour'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booking Date:</Text>
            <Text style={styles.summaryValue}>
              {new Date(booking.booking_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Participants:</Text>
            <Text style={styles.summaryValue}>{booking.number_of_participants}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reference:</Text>
            <Text style={styles.summaryValue}>{booking.booking_reference}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${booking.total_price}</Text>
          </View>
        </View>

        {/* Payment Type */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Type</Text>
          <TouchableOpacity
            style={[
              styles.paymentTypeOption,
              selectedPaymentType === 'full' && styles.selectedOption,
            ]}
            onPress={() => setSelectedPaymentType('full')}
          >
            <View style={styles.optionContent}>
              <View>
                <Text style={styles.optionTitle}>Pay Full Amount</Text>
                <Text style={styles.optionSubtitle}>Complete payment now</Text>
              </View>
              <Text style={styles.optionPrice}>${booking.total_price}</Text>
            </View>
            {selectedPaymentType === 'full' && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentTypeOption,
              selectedPaymentType === 'deposit' && styles.selectedOption,
            ]}
            onPress={() => setSelectedPaymentType('deposit')}
          >
            <View style={styles.optionContent}>
              <View>
                <Text style={styles.optionTitle}>Pay Deposit (30%)</Text>
                <Text style={styles.optionSubtitle}>
                  Pay remaining ${remainingBalance.toFixed(2)} later
                </Text>
              </View>
              <Text style={styles.optionPrice}>${depositAmount.toFixed(2)}</Text>
            </View>
            {selectedPaymentType === 'deposit' && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodOption,
                selectedPaymentMethod === method.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={
                    selectedPaymentMethod === method.id
                      ? theme.colors.primary
                      : theme.colors.textLight
                  }
                />
                <Text style={styles.methodName}>{method.name}</Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Type:</Text>
            <Text style={styles.summaryValue}>
              {selectedPaymentType === 'full' ? 'Full Payment' : 'Deposit (30%)'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method:</Text>
            <Text style={styles.summaryValue}>
              {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.amountRow]}>
            <Text style={styles.amountLabel}>Amount to Pay:</Text>
            <Text style={styles.amountValue}>
              ${selectedPaymentType === 'full' ? booking.total_price : depositAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button title="Process Payment" onPress={handlePayment} />
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              Alert.alert(
                'Skip Payment',
                'You can pay later. Your booking will remain as unpaid.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Skip',
                    onPress: () => {
                      if (isAuthenticated) {
                        navigation.navigate('Main', { screen: 'Profile' });
                      } else {
                        navigation.navigate('Home');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.skipButtonText}>Pay Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  paymentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E8F5E9',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  paymentSummary: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  amountRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  amountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  actions: {
    marginBottom: 20,
  },
  skipButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
});

export default CheckoutScreen;
