import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import theme from '../constants/theme';

const TourCard = ({ title, image, price, rating, style }) => (
  <View style={[styles.card, style]}>
    <Image source={{ uri: image }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price}</Text>
      <Text style={styles.rating}>⭐ {rating}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: colors.text,
  },
  price: {
    fontSize: theme.fontSizes.md,
    color: colors.primary,
    marginTop: theme.spacing.xs,
  },
  rating: {
    fontSize: theme.fontSizes.sm,
    color: colors.muted,
    marginTop: theme.spacing.xs,
  },
});

export default TourCard;
