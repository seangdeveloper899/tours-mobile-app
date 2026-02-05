import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TourCard, LoadingSpinner } from '../components';
import theme from '../constants/theme';
import { categoriesAPI, toursAPI } from '../config/apiService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollViewRef = useRef(null);

  const banners = [
    {
      title: 'Discover Amazing',
      titleHighlight: 'Adventures',
      subtitle: 'Experience unforgettable tours with our licensed professional guides',
      image: null,
    },
    {
      title: 'Licensed',
      titleHighlight: 'Expert Guides',
      subtitle: 'Travel with certified guides who know every hidden gem',
      image: null,
    },
    {
      title: 'Best Price',
      titleHighlight: 'Guarantee',
      subtitle: 'Premium quality tours at unbeatable prices',
      image: null,
    },
  ];

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories and featured tours from API
      const [categoriesResponse, toursResponse] = await Promise.all([
        categoriesAPI.getAll(),
        toursAPI.getFeatured(6)
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (toursResponse.success) {
        setFeaturedTours(toursResponse.data);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent crashes
      setCategories([]);
      setFeaturedTours([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentBanner(index);
        }}
      >
        {banners.map((banner, index) => (
          <LinearGradient
            key={index}
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.banner}
          >
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>
                {banner.title}{' '}
                <Text style={styles.bannerHighlight}>{banner.titleHighlight}</Text>
              </Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              <View style={styles.bannerButtons}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Tours')}
                >
                  <Ionicons name="search" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.primaryButtonText}>Explore Tours</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentBanner && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsCard}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.statsGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>Happy Travelers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Tours Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Expert Guides</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15 Years</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Why Choose <Text style={styles.gradient}>Us?</Text>
      </Text>
      <View style={styles.featuresGrid}>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="star" size={28} color={theme.colors.white} />
          </View>
          <Text style={styles.featureTitle}>Top Quality Tours</Text>
          <Text style={styles.featureText}>
            Premium private tours at exceptional value with licensed guides
          </Text>
        </View>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.info }]}>
            <Ionicons name="shield-checkmark" size={28} color={theme.colors.white} />
          </View>
          <Text style={styles.featureTitle}>Best Price Guarantee</Text>
          <Text style={styles.featureText}>
            Competitive pricing with no hidden fees or extra charges
          </Text>
        </View>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.error }]}>
            <Ionicons name="heart" size={28} color={theme.colors.white} />
          </View>
          <Text style={styles.featureTitle}>24/7 Support</Text>
          <Text style={styles.featureText}>
            Round-the-clock customer support for all your needs
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Explore by <Text style={styles.gradient}>Category</Text>
      </Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Tours', { category: category.slug })}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name={category.icon} size={24} color={theme.colors.white} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryCount}>{category.tours_count} tours</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFeaturedTours = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Featured <Text style={styles.gradient}>Tours</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tours')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      {featuredTours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onPress={() => navigation.navigate('TourDetails', { tourId: tour.slug, tour })}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderBanner()}
        {renderStats()}
        {renderFeatures()}
        {renderCategories()}
        {renderFeaturedTours()}
      </ScrollView>
    </View>
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
  bannerContainer: {
    height: 400,
    position: 'relative',
  },
  banner: {
    width,
    height: 400,
    justifyContent: 'center',
  },
  bannerOverlay: {
    padding: theme.spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 36,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: 12,
  },
  bannerHighlight: {
    color: theme.colors.secondary,
  },
  bannerSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.white,
    marginBottom: 24,
    opacity: 0.95,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: theme.colors.white,
    width: 24,
  },
  statsCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: -40,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  statsGradient: {
    padding: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    opacity: 0.9,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  gradient: {
    color: theme.colors.primary,
  },
  viewAllText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  featuresGrid: {
    gap: theme.spacing.md,
  },
  featureCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  featureText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  categoryCard: {
    width: (width - theme.spacing.md * 3 - 12) / 2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen;
