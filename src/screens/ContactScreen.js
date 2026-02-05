import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button } from '../components';
import theme from '../constants/theme';
import { contactAPI } from '../config/apiService';

const ContactScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Submit contact form to API
      const response = await contactAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      setLoading(false);

      if (response.success) {
        Alert.alert(
          'Message Sent!',
          'Thank you for contacting us. We will get back to you shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  message: '',
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
      }
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+85567567890');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@tours-website.com');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Get in Touch" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Contact Info Cards */}
        <View style={styles.infoCardsContainer}>
          <TouchableOpacity style={styles.infoCard} onPress={handleCall}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="call" size={28} color={theme.colors.white} />
            </View>
            <Text style={styles.infoTitle}>Phone</Text>
            <Text style={styles.infoText}>+855 67 567 890</Text>
            <Text style={styles.infoSubtext}>Mon-Fri 8AM-6PM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard} onPress={handleEmail}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.info }]}>
              <Ionicons name="mail" size={28} color={theme.colors.white} />
            </View>
            <Text style={styles.infoTitle}>Email</Text>
            <Text style={styles.infoText}>info@tours-website.com</Text>
            <Text style={styles.infoSubtext}>24/7 Support</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning }]}>
              <Ionicons name="location" size={28} color={theme.colors.white} />
            </View>
            <Text style={styles.infoTitle}>Address</Text>
            <Text style={styles.infoText}>Siem Reap, Cambodia</Text>
            <Text style={styles.infoSubtext}>Visit us anytime</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.error }]}>
              <Ionicons name="time" size={28} color={theme.colors.white} />
            </View>
            <Text style={styles.infoTitle}>Working Hours</Text>
            <Text style={styles.infoText}>Mon - Fri: 8AM - 6PM</Text>
            <Text style={styles.infoSubtext}>Sat - Sun: 9AM - 5PM</Text>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Send Us a Message</Text>
          <Text style={styles.formSubtitle}>
            Have questions? We're here to help! Our team is ready to assist you with your travel plans.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="person" size={16} color={theme.colors.primary} /> Your Name *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="mail" size={16} color={theme.colors.primary} /> Email Address *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="call" size={16} color={theme.colors.primary} /> Phone Number
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+855 12 345 678"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="pricetag" size={16} color={theme.colors.primary} /> Subject *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="What is this regarding?"
              value={formData.subject}
              onChangeText={(text) => handleInputChange('subject', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} color={theme.colors.primary} /> Message *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChangeText={(text) => handleInputChange('message', text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <Button
            title={loading ? 'Sending...' : 'Send Message'}
            onPress={handleSubmit}
            disabled={loading}
            icon={<Ionicons name="send" size={20} color={theme.colors.white} />}
          />
        </View>

        {/* Social Media */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877f2' }]}>
              <Ionicons name="logo-facebook" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#E4405F' }]}>
              <Ionicons name="logo-instagram" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}>
              <Ionicons name="logo-twitter" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#25D366' }]}>
              <Ionicons name="logo-whatsapp" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <View style={styles.faqQuestion}>
              <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.faqQuestionText}>How do I book a tour?</Text>
            </View>
            <Text style={styles.faqAnswer}>
              Browse our tours, select your preferred tour, and click "Book Now" to complete your reservation.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <View style={styles.faqQuestion}>
              <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.faqQuestionText}>What is your cancellation policy?</Text>
            </View>
            <Text style={styles.faqAnswer}>
              Free cancellation up to 48 hours before the tour date. Contact us for more details.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <View style={styles.faqQuestion}>
              <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.faqQuestionText}>Are your guides licensed?</Text>
            </View>
            <Text style={styles.faqAnswer}>
              Yes! All our tour guides are professionally licensed and highly experienced.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  formTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: theme.spacing.sm,
  },
  socialContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  socialTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  faqContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  faqTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  faqItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  faqQuestionText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  faqAnswer: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 28,
  },
});

export default ContactScreen;
