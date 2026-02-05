import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import colors from '../constants/colors';
import theme from '../constants/theme';

const bannerImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
];

const categories = [
  'Adventure', 'Culture', 'Nature', 'Family', 'Luxury', 'Budget'
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Home" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerCarousel}>
        {bannerImages.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.bannerImage} />
        ))}
      </ScrollView>
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>App Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNumber}>120+</Text><Text style={styles.statLabel}>Tours</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>4.8</Text><Text style={styles.statLabel}>Rating</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>10K+</Text><Text style={styles.statLabel}>Users</Text></View>
        </View>
      </View>
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {categories.map((cat, idx) => (
            <Button key={idx} title={cat} style={styles.categoryBtn} textStyle={styles.categoryText} />
          ))}
        </View>
      </View>
      <View style={styles.featuredSection}>
        <Text style={styles.featuredTitle}>Featured Tours</Text>
        <Text style={styles.featuredDesc}>Check out our most popular tours!</Text>
        {/* Featured tours will be listed here in future steps */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bannerCarousel: {
    marginTop: theme.spacing.md,
    height: 180,
  },
  bannerImage: {
    width: 320,
    height: 180,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
  },
  statsSection: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: colors.muted,
  },
  categoriesSection: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  categoriesTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryBtn: {
    margin: theme.spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: colors.text,
    fontWeight: theme.fontWeights.medium,
  },
  featuredSection: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  featuredTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  featuredDesc: {
    fontSize: theme.fontSizes.sm,
    color: colors.muted,
    marginBottom: theme.spacing.md,
  },
});
