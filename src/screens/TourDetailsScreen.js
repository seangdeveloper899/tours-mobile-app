import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LoadingSpinner, Button } from '../components';
import theme from '../constants/theme';
import { toursAPI } from '../config/apiService';
import { BASE_URL } from '../config/api';
import { useThemeColors } from '../hooks/useThemeColors';

const { width } = Dimensions.get('window');

const TourDetailsScreen = ({ route, navigation }) => {
  const { tourId, tour: initialTour } = route.params; // tourId is actually the slug
  const themeColors = useThemeColors();
  const [loading, setLoading] = useState(!initialTour);
  const [tour, setTour] = useState(initialTour || null);

  useEffect(() => {
    if (!initialTour) {
      fetchTourDetails();
    }
  }, [tourId]);

  const fetchTourDetails = async () => {
    try {
      // Fetch tour details from API using slug (tourId is the slug parameter)
      const response = await toursAPI.getBySlug(tourId);
      
      if (response.success) {
        setTour(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tour details:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={theme.colors.secondary}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!tour) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Tour not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const imageUri = tour.featured_image
    ? `${BASE_URL}/storage/${tour.featured_image}`
    : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[theme.colors.primaryLight, theme.colors.primary]}
              style={styles.heroImage}
            >
              <Ionicons name="image-outline" size={80} color={theme.colors.white} />
            </LinearGradient>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Tour Header */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{tour.category.name}</Text>
          </View>
          <Text style={styles.title}>{tour.title}</Text>
          
          {tour.reviews_count > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>{renderStars(Math.round(tour.reviews_avg_rating))}</View>
              <Text style={styles.reviewCount}>({tour.reviews_count} reviews)</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>{tour.duration_days} day(s)</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>Max {tour.max_participants}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{tour.duration_days} Days</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Group Size</Text>
            <Text style={styles.statValue}>Max {tour.max_participants}</Text>
          </View>
          {tour.difficulty_level && (
            <View style={styles.statBox}>
              <Ionicons name="trending-up-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{tour.difficulty_level}</Text>
            </View>
          )}
          {tour.meeting_point && (
            <View style={styles.statBox}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statLabel}>Pickup</Text>
              <Text style={styles.statValue}>Available</Text>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>About This Tour</Text>
          </View>
          <Text style={styles.description}>{tour.description}</Text>
        </View>

        {/* Itinerary */}
        {tour.itinerary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Itinerary</Text>
            </View>
            <Text style={styles.itinerary}>{tour.itinerary}</Text>
          </View>
        )}

        {/* Included/Excluded */}
        <View style={styles.includeExcludeContainer}>
          {tour.included_items && tour.included_items.length > 0 && (
            <View style={styles.includeBox}>
              <View style={styles.includeHeader}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.includeTitle}>Included</Text>
              </View>
              {tour.included_items.map((item, index) => (
                <View key={index} style={styles.includeItem}>
                  <Ionicons name="checkmark" size={16} color={theme.colors.success} />
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {tour.excluded_items && tour.excluded_items.length > 0 && (
            <View style={styles.excludeBox}>
              <View style={styles.excludeHeader}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                <Text style={styles.excludeTitle}>Not Included</Text>
              </View>
              {tour.excluded_items.map((item, index) => (
                <View key={index} style={styles.excludeItem}>
                  <Ionicons name="close" size={16} color={theme.colors.error} />
                  <Text style={styles.excludeText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Reviews */}
        {tour.reviews && tour.reviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={24} color={theme.colors.secondary} />
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
            </View>
            {tour.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewName}>{review.customer_name}</Text>
                    <View style={styles.stars}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>${tour.price}</Text>
          <Text style={styles.priceUnit}>per person</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() => navigation.navigate('Booking', { tour })}
          icon={<Ionicons name="calendar" size={20} color={theme.colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  categoryBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  reviewCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    minWidth: (width - theme.spacing.md * 3) / 2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  section: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  itinerary: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  includeExcludeContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  includeBox: {
    backgroundColor: '#f0fdf4',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  includeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  includeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  includeText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  excludeBox: {
    backgroundColor: '#fef2f2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  excludeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  excludeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.error,
  },
  excludeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  excludeText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  reviewCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  reviewName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  reviewComment: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  price: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  priceUnit: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
  },
});

export default TourDetailsScreen;
