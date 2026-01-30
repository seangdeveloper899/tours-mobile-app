import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const LoadingSpinner = ({ size = 'large', color = colors.primary, style }) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingSpinner;
