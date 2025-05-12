import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
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
              <Ionicons name="document-text" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Please read our Terms of Service carefully
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.termsContainer}>
                <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
                  Last Updated: January 15, 2025
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  1. Acceptance of Terms
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  By accessing or using the Food Dictate App ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  2. Description of Service
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  Food Dictate is a mobile application that provides food recognition, nutritional information, and dietary recommendations. The App allows users to scan food items, track nutritional intake, and receive personalized meal suggestions.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  3. User Accounts
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  To use certain features of the App, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information to keep it accurate and current.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  4. User Content
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  You retain ownership of any content you submit to the App, including food images, reviews, and comments. By submitting content, you grant Food Dictate a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content for the purpose of providing and improving the App's services.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  5. Health Disclaimer
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  The nutritional information and dietary recommendations provided by the App are for informational purposes only and are not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before making significant changes to your diet or if you have any health concerns.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  6. Food Recognition Accuracy
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  While we strive for accuracy in our food recognition technology, we cannot guarantee that all food items will be correctly identified or that nutritional information will be 100% accurate. Users should verify important nutritional information from product packaging or other reliable sources.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  7. Privacy Policy
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  Your use of the App is also governed by our Privacy Policy, which can be found at [Privacy Policy Link]. By using the App, you consent to the collection and use of your information as described in the Privacy Policy.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  8. Subscription and Payments
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  Some features of the App may require a subscription. By subscribing, you agree to pay the fees as they become due. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. Refunds are provided in accordance with the platform's (Apple App Store or Google Play Store) refund policies.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  9. Prohibited Conduct
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  You agree not to:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Use the App for any illegal purpose or in violation of any laws
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Attempt to gain unauthorized access to the App or its systems
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Interfere with or disrupt the App's functionality
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Upload content that is harmful, offensive, or infringing
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Use the App to transmit malware or other harmful code
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  10. Termination
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We reserve the right to terminate or suspend your account and access to the App at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  11. Changes to Terms
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We may modify these Terms of Service at any time. We will notify you of significant changes by posting a notice on the App or sending you an email. Your continued use of the App after such modifications constitutes your acceptance of the revised terms.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  12. Contact Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  If you have any questions about these Terms of Service, please contact us at:
                </Text>
                <Text style={[styles.contactInfo, { color: colors.primary }]}>
                  eyongkomatchfire@gmail.com
                </Text>
                <Text style={[styles.contactInfo, { color: colors.text }]}>
                  Food Dictate, Inc.
                </Text>
                <Text style={[styles.contactInfo, { color: colors.text }]}>
                  +237673953558
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            By using Food Dictate, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
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
  termsContainer: {
    paddingVertical: 8,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
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
