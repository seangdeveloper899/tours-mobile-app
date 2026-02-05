import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import colors from '../constants/colors';
import theme from '../constants/theme';

const faqs = [
  { q: 'How do I book a tour?', a: 'Go to the Tours tab, select a tour, and click Book Now.' },
  { q: 'Can I cancel my booking?', a: 'Yes, contact support for cancellation.' },
  { q: 'Are group discounts available?', a: 'Yes, for groups of 5 or more.' },
];

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Contact" />
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.info}>Email: support@toursapp.com</Text>
      <Text style={styles.info}>Phone: +1 234 567 890</Text>
      <Text style={styles.sectionTitle}>FAQ</Text>
      {faqs.map((faq, idx) => (
        <View key={idx} style={styles.faqBox}>
          <Text style={styles.faqQ}>{faq.q}</Text>
          <Text style={styles.faqA}>{faq.a}</Text>
        </View>
      ))}
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
  info: {
    fontSize: theme.fontSizes.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.medium,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  faqBox: {
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
  faqQ: {
    fontWeight: theme.fontWeights.bold,
    color: colors.primary,
  },
  faqA: {
    fontSize: theme.fontSizes.md,
    color: colors.text,
  },
});
