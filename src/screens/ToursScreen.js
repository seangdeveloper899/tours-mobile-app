import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TourCard, LoadingSpinner, Header } from '../components';
import theme from '../constants/theme';
import { categoriesAPI, toursAPI } from '../config/apiService';
import { useThemeColors } from '../hooks/useThemeColors';

const ToursScreen = ({ navigation, route }) => {
  const themeColors = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: route.params?.category || '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    sort: 'featured',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      // Fetch categories from API
      const categoriesResponse = await categoriesAPI.getAll();
      
      if (categoriesResponse.success) {
        // Add "All Categories" option at the beginning
        setCategories([
          { id: 0, name: 'All Categories', slug: '', tours_count: 0 },
          ...categoriesResponse.data
        ]);
      }

      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;
      if (filters.duration) params.duration = filters.duration;
      if (filters.sort) params.sort = filters.sort;
      params.per_page = 20;

      // Fetch tours from API
      const toursResponse = await toursAPI.getAll(params);
      
      if (toursResponse.success) {
        setTours(toursResponse.data);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      sort: 'featured',
    });
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tours..."
          value={filters.search}
          onChangeText={(text) => handleFilterChange('search', text)}
        />
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? 'close' : 'options'}
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  filters.category === cat.slug && styles.categoryChipActive,
                ]}
                onPress={() => handleFilterChange('category', cat.slug)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    filters.category === cat.slug && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Price Range</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min $"
              keyboardType="numeric"
              value={filters.minPrice}
              onChangeText={(text) => handleFilterChange('minPrice', text)}
            />
            <Text style={styles.priceRangeSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max $"
              keyboardType="numeric"
              value={filters.maxPrice}
              onChangeText={(text) => handleFilterChange('maxPrice', text)}
            />
          </View>

          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.sortButtons}>
            {[
              { value: 'featured', label: 'Featured' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortButton,
                  filters.sort === option.value && styles.sortButtonActive,
                ]}
                onPress={() => handleFilterChange('sort', option.value)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    filters.sort === option.value && styles.sortButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Ionicons name="refresh" size={18} color={theme.colors.white} />
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'bottom']}>
      <Header title="Explore Tours" />
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TourCard
            tour={item}
            onPress={() => navigation.navigate('TourDetails', { tourId: item.slug, tour: item })}
          />
        )}
        ListHeaderComponent={
          <>
            {renderFilters()}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>{tours.length} Tours Found</Text>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No tours found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />
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
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.md,
  },
  filterToggleButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  filterLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  categoryScroll: {
    marginBottom: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  categoryChipTextActive: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  priceInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.md,
  },
  priceRangeSeparator: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  sortButtons: {
    gap: theme.spacing.sm,
  },
  sortButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  sortButtonTextActive: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.textSecondary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  resultsHeader: {
    paddingVertical: theme.spacing.md,
  },
  resultsText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
});

export default ToursScreen;
