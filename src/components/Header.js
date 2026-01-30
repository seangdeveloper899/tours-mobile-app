import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import theme from '../constants/theme';

const Header = ({ title, style, textStyle }) => (
  <View style={[styles.container, style]}>
    <Text style={[styles.title, textStyle]}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.surface,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 1,
  },
});

export default Header;
