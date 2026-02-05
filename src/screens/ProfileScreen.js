import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../config/apiService';
import theme from '../constants/theme';
import { LoadingSpinner, Button } from '../components';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload bookings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadBookings();
      }
    }, [isAuthenticated])
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getBookings();
      
      if (response.success) {
        setBookings(response.data.bookings);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleCancelBooking = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await authAPI.cancelBooking(bookingId);
              if (response.success) {
                Alert.alert('Success', 'Booking cancelled successfully');
                loadBookings();
              } else {
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.primary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textLight;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return theme.colors.success;
      case 'partial':
        return theme.colors.warning;
      case 'unpaid':
        return theme.colors.error;
      default:
        return theme.colors.textLight;
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthContainer}>
          <Ionicons name="person-circle-outline" size={100} color={theme.colors.textLight} />
          <Text style={styles.unauthTitle}>Sign In Required</Text>
          <Text style={styles.unauthText}>
            Please sign in to view your profile and booking history
          </Text>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            style={styles.signInButton}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
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
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {user?.phone && <Text style={styles.userPhone}>{user?.phone}</Text>}
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        {statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                {statistics.pending}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {statistics.confirmed}
              </Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {statistics.completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Bookings</Text>

          {bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>
                Start exploring tours and make your first booking
              </Text>
              <Button
                title="Browse Tours"
                onPress={() => navigation.navigate('Tours')}
                style={styles.browseButton}
              />
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingTitle}>{booking.tour.title}</Text>
                  <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text style={styles.badgeText}>{booking.status}</Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getPaymentStatusColor(booking.payment_status) },
                      ]}
                    >
                      <Text style={styles.badgeText}>{booking.payment_status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>
                      {booking.number_of_participants} participant(s)
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>${booking.total_price}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="pricetag-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>{booking.booking_reference}</Text>
                  </View>
                </View>

                <View style={styles.bookingActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('BookingDetails', { bookingId: booking.id })}
                  >
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelBooking(booking.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
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
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  unauthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  unauthText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  signInButton: {
    width: '100%',
    marginBottom: 15,
  },
  registerLink: {
    padding: 10,
  },
  registerLinkText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  registerLinkBold: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  logoutButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    width: '100%',
  },
  bookingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bookingHeader: {
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
});

export default ProfileScreen;
