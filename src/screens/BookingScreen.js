import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const BookingScreen = () => (
  <View style={styles.container}>
    <Header title="Booking" />
    <Text>Booking form will be here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BookingScreen;
