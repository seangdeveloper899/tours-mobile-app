import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import theme from '../constants/theme';

const Button = ({ title, onPress, style, textStyle, ...props }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.8}
    {...props}
  >
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.surface,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
  },
});

export default Button;
