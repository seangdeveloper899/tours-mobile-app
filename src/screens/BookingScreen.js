import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import colors from '../constants/colors';
import theme from '../constants/theme';

export default function BookingScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name && email && date) {
      setSubmitted(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Booking" />
      <Text style={styles.title}>Book Your Tour</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <Button title="Submit" onPress={handleSubmit} style={styles.submitBtn} />
        {submitted && <Text style={styles.success}>Booking submitted!</Text>}
      </View>
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
  form: {
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    marginBottom: theme.spacing.md,
  },
  success: {
    color: colors.success,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing.sm,
  },
});
