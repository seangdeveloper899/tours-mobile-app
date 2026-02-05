import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import TourCard from '../components/TourCard';
import colors from '../constants/colors';
import theme from '../constants/theme';

const tours = [
  {
    title: 'Mountain Adventure',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    price: 199,
    rating: 4.9,
  },
  {
    title: 'City Explorer',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    price: 149,
    rating: 4.7,
  },
  {
    title: 'Beach Paradise',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    price: 249,
    rating: 4.8,
  },
];

export default function ToursScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Tours" />
      <Text style={styles.title}>Browse Tours</Text>
      <View style={styles.list}>
        {tours.map((tour, idx) => (
          <TourCard key={idx} {...tour} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    margin: theme.spacing.lg,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
  },
});
