import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const TourDetailsScreen = () => (
  <View style={styles.container}>
    <Header title="Tour Details" />
    <Text>Tour details will be shown here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TourDetailsScreen;
