import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
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
              <Ionicons name="shield-checkmark" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Your privacy is important to us
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
              <View style={styles.policyContainer}>
                <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
                  Last Updated: June 1, 2023
                </Text>

                <Text style={[styles.introduction, { color: colors.text }]}>
                  Food Dictate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App").
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  1. Information We Collect
                </Text>

                <Text style={[styles.subHeader, { color: colors.text }]}>
                  1.1 Personal Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We may collect personal information that you voluntarily provide when using the App, including:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Name, email address, and other contact information
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Account credentials (username and password)
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Profile information (age, gender, height, weight)
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Health and dietary information (allergies, preferences, restrictions)
                </Text>

                <Text style={[styles.subHeader, { color: colors.text }]}>
                  1.2 Usage Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We automatically collect certain information when you use the App, including:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Device information (model, operating system, unique device identifiers)
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • IP address and location information
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • App usage statistics and interaction data
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Food images and scan data
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  2. How We Use Your Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We may use the information we collect for various purposes, including:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Providing and maintaining the App's functionality
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Personalizing your experience and delivering tailored content
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Processing food recognition and providing nutritional information
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Generating personalized meal recommendations
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Analyzing usage patterns to improve the App
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Communicating with you about updates, features, or support
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Ensuring the security and integrity of the App
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  3. Sharing Your Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We may share your information with:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Service providers who perform services on our behalf
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Analytics partners to help us understand App usage
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Business partners for joint offerings (with your consent)
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Legal authorities when required by law or to protect rights
                </Text>

                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We do not sell your personal information to third parties.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  4. Data Security
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We implement appropriate technical and organizational measures to protect your information from unauthorized access, loss, or alteration. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  5. Data Retention
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. You can request deletion of your account and associated data at any time.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  6. Your Rights and Choices
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Accessing, correcting, or deleting your information
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Restricting or objecting to our processing of your information
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Receiving your information in a portable format
                </Text>
                <Text style={[styles.bulletPoint, { color: colors.text }]}>
                  • Withdrawing consent where processing is based on consent
                </Text>

                <Text style={[styles.paragraph, { color: colors.text }]}>
                  You can exercise these rights by contacting us at eyongko@match.fire.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  7. Children's Privacy
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  The App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  8. Changes to This Privacy Policy
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </Text>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                  9. Contact Us
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  If you have questions or concerns about this Privacy Policy, please contact us at:
                </Text>
                <Text style={[styles.contactInfo, { color: colors.primary }]}>
                  eyongko@match.fire
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
            By using Food Dictate, you consent to our collection, use, and disclosure of your information as described in this Privacy Policy.
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
  policyContainer: {
    paddingVertical: 8,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  introduction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
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
