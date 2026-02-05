import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';
import { LoadingSpinner } from '../components';
import { bookingsAPI } from '../config/apiService';

const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      const response = await bookingsAPI.getById(bookingId);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookingDetails();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: theme.colors.warning,
      confirmed: theme.colors.success,
      completed: theme.colors.primary,
      cancelled: theme.colors.error,
    };
    return colors[status] || theme.colors.textLight;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: theme.colors.error,
      partial: theme.colors.warning,
      paid: theme.colors.success,
    };
    return colors[status] || theme.colors.textLight;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Booking not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBackButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tour Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tour Information</Text>
          <View style={styles.card}>
            <Text style={styles.tourName}>{booking.tour?.name || 'N/A'}</Text>
            {booking.tour?.description && (
              <Text style={styles.tourDescription} numberOfLines={3}>
                {booking.tour.description}
              </Text>
            )}
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference</Text>
              <Text style={styles.detailValue}>{booking.booking_reference}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {formatDateToDDMMYYYY(booking.booking_date)}
              </Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>{booking.number_of_participants}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <Text style={[styles.badgeText, { color: getStatusColor(booking.status) }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <View style={[styles.badge, { backgroundColor: getPaymentStatusColor(booking.payment_status) + '20' }]}>
                <Text style={[styles.badgeText, { color: getPaymentStatusColor(booking.payment_status) }]}>
                  {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{booking.customer_name}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={[styles.detailValue, styles.emailText]}>{booking.customer_email}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{booking.customer_phone}</Text>
            </View>
            
            {booking.special_requests && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Special Requests</Text>
                  <Text style={styles.specialRequests}>{booking.special_requests}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Price</Text>
              <Text style={styles.priceValue}>${parseFloat(booking.total_price).toFixed(2)}</Text>
            </View>
            
            {booking.deposit_amount > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Deposit Paid</Text>
                  <Text style={styles.detailValue}>${parseFloat(booking.deposit_amount).toFixed(2)}</Text>
                </View>
              </>
            )}
            
            {booking.payment_method && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <Text style={styles.detailValue}>
                    {booking.payment_method.charAt(0).toUpperCase() + booking.payment_method.slice(1)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Transactions */}
        {booking.transactions && booking.transactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {booking.transactions.map((transaction, index) => (
              <View key={transaction.id} style={[styles.card, styles.transactionCard]}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={transaction.status === 'completed' ? 'checkmark-circle' : 'close-circle'}
                      size={24}
                      color={transaction.status === 'completed' ? theme.colors.success : theme.colors.error}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                      {new Date(transaction.created_at).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.transactionAmount}>
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.transactionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.badge, { backgroundColor: getPaymentStatusColor(transaction.status === 'completed' ? 'paid' : 'unpaid') + '20' }]}>
                      <Text style={[styles.badgeText, { color: getPaymentStatusColor(transaction.status === 'completed' ? 'paid' : 'unpaid') }]}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  {transaction.payment_method && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Method</Text>
                        <Text style={styles.detailValue}>
                          {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}
                        </Text>
                      </View>
                    </>
                  )}
                  
                  {transaction.description && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Description</Text>
                        <Text style={styles.transactionDescription}>{transaction.description}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
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
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  tourDescription: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailColumn: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  emailText: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  specialRequests: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  transactionDetails: {
    marginTop: 8,
  },
  transactionDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default BookingDetailsScreen;
