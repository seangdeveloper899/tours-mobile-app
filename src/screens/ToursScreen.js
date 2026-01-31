import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const ToursScreen = () => (
  <View style={styles.container}>
    <Header title="Tours" />
    <Text>Browse all tours here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ToursScreen;
