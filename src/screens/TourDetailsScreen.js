import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import colors from '../constants/colors';
import theme from '../constants/theme';

const tour = {
  title: 'Mountain Adventure',
  itinerary: [
    'Day 1: Arrival and orientation',
    'Day 2: Hiking and sightseeing',
    'Day 3: Local culture tour',
    'Day 4: Departure',
  ],
  reviews: [
    { user: 'Alice', comment: 'Amazing experience!', rating: 5 },
    { user: 'Bob', comment: 'Loved every moment.', rating: 4.5 },
  ],
};

export default function TourDetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Tour Details" />
      <Text style={styles.title}>{tour.title}</Text>
      <Text style={styles.sectionTitle}>Itinerary</Text>
      {tour.itinerary.map((item, idx) => (
        <Text key={idx} style={styles.itineraryItem}>{item}</Text>
      ))}
      <Text style={styles.sectionTitle}>Reviews</Text>
      {tour.reviews.map((review, idx) => (
        <View key={idx} style={styles.reviewBox}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
        </View>
      ))}
      <Button title="Book Now" style={styles.bookBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    margin: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.medium,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  itineraryItem: {
    fontSize: theme.fontSizes.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
    color: colors.text,
  },
  reviewBox: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  reviewUser: {
    fontWeight: theme.fontWeights.bold,
    color: colors.primary,
  },
  reviewComment: {
    fontSize: theme.fontSizes.md,
    color: colors.text,
  },
  reviewRating: {
    fontSize: theme.fontSizes.sm,
    color: colors.muted,
  },
  bookBtn: {
    margin: theme.spacing.lg,
    backgroundColor: colors.primary,
  },
});
