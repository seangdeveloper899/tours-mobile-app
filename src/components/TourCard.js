import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';
import { BASE_URL } from '../config/api';

const TourCard = ({ tour, onPress }) => {
  const imageUri = tour.featured_image 
    ? `${BASE_URL}/storage/${tour.featured_image}`
    : null;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={12}
          color={theme.colors.secondary}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[theme.colors.primaryLight, theme.colors.primary]}
              style={styles.placeholderImage}
            >
              <Ionicons name="image-outline" size={48} color={theme.colors.white} />
            </LinearGradient>
          )}
          {tour.is_featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.category}>{tour.category?.name || 'Tour'}</Text>
          <Text style={styles.title} numberOfLines={2}>{tour.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{tour.description}</Text>
          
          {tour.reviews_count > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(Math.round(tour.reviews_avg_rating || 0))}
              </View>
              <Text style={styles.reviewCount}>({tour.reviews_count})</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.infoText}>{tour.duration_days}d</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.infoText}>Max {tour.max_participants}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>From</Text>
              <Text style={styles.price}>${tour.price}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  featuredText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    padding: theme.spacing.md,
  },
  category: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  price: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
    marginRight: 4,
  },
});

export default TourCard;
