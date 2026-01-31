import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const HomeScreen = () => (
  <View style={styles.container}>
    <Header title="Home" />
    <Text>Welcome to the Tours App!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
