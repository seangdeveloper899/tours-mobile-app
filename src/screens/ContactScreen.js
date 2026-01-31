import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const ContactScreen = () => (
  <View style={styles.container}>
    <Header title="Contact" />
    <Text>Contact information and FAQ will be here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactScreen;
