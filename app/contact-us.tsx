import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Contact form types
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Contact form initial state
const initialFormState: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export default function ContactUsScreen() {
  const { colors } = useTheme();
  const [form, setForm] = useState<ContactForm>(initialFormState);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Message Sent',
        'Thank you for your message. We will get back to you as soon as possible.',
        [
          {
            text: 'OK',
            onPress: () => {
              setForm(initialFormState);
              router.back();
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBannerGradient}
          >
            <View style={[styles.headerBannerContent, { backgroundColor: colors.card + '99' }]}>
              <Ionicons name="chatbubbles" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                We'd love to hear from you! Send us your questions or feedback.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Our Contact Information</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.contactInfoContainer}>
                <View style={styles.contactInfoItem}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="mail" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfoText}>
                    <Text style={[styles.contactInfoLabel, { color: colors.textSecondary }]}>Email</Text>
                    <Text style={[styles.contactInfoValue, { color: colors.text }]}>eyongkomatchfire@gmail.com</Text>
                  </View>
                </View>

                <View style={styles.contactInfoItem}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="call" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfoText}>
                    <Text style={[styles.contactInfoLabel, { color: colors.textSecondary }]}>Phone</Text>
                    <Text style={[styles.contactInfoValue, { color: colors.text }]}>+237673953558</Text>
                  </View>
                </View>

                <View style={styles.contactInfoItem}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="location" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfoText}>
                    <Text style={[styles.contactInfoLabel, { color: colors.textSecondary }]}>Address</Text>
                    <Text style={[styles.contactInfoValue, { color: colors.text }]}>
                      123 Nutrition Street, Health City, CA 94103
                    </Text>
                  </View>
                </View>

                <View style={styles.contactInfoItem}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="time" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfoText}>
                    <Text style={[styles.contactInfoLabel, { color: colors.textSecondary }]}>Hours</Text>
                    <Text style={[styles.contactInfoValue, { color: colors.text }]}>
                      Monday - Friday: 9am - 5pm PST
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Contact Form Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Send Us a Message</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.formContainer}>
                {/* Name Field */}
                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Name</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        color: colors.text,
                        borderColor: errors.name ? colors.error : colors.border
                      }
                    ]}
                    value={form.name}
                    onChangeText={(text) => handleChange('name', text)}
                    placeholder="Your name"
                    placeholderTextColor={colors.textSecondary}
                  />
                  {errors.name && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>
                  )}
                </View>

                {/* Email Field */}
                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Email</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        color: colors.text,
                        borderColor: errors.email ? colors.error : colors.border
                      }
                    ]}
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholder="Your email address"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
                  )}
                </View>

                {/* Subject Field */}
                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Subject</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        color: colors.text,
                        borderColor: errors.subject ? colors.error : colors.border
                      }
                    ]}
                    value={form.subject}
                    onChangeText={(text) => handleChange('subject', text)}
                    placeholder="Subject of your message"
                    placeholderTextColor={colors.textSecondary}
                  />
                  {errors.subject && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.subject}</Text>
                  )}
                </View>

                {/* Message Field */}
                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Message</Text>
                  <TextInput
                    style={[
                      styles.formTextarea,
                      {
                        color: colors.text,
                        borderColor: errors.message ? colors.error : colors.border
                      }
                    ]}
                    value={form.message}
                    onChangeText={(text) => handleChange('message', text)}
                    placeholder="Your message"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  {errors.message && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.message}</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Send Message</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Connect With Us</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.socialMediaContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={28} color="#3b5998" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-twitter" size={28} color="#1da1f2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={28} color="#e1306c" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-youtube" size={28} color="#ff0000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-linkedin" size={28} color="#0077b5" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            We aim to respond to all messages within 24 hours.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  headerBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  headerBannerGradient: {
    borderRadius: 15,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
  headerBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
  },
  headerBannerText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionGradient: {
    marginHorizontal: 16,
    borderRadius: 15,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  sectionContent: {
    borderRadius: 15,
    padding: 16,
  },
  contactInfoContainer: {
    paddingVertical: 8,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfoText: {
    flex: 1,
  },
  contactInfoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  contactInfoValue: {
    fontSize: 16,
  },
  formContainer: {
    paddingVertical: 8,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 120,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
