import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// FAQ data
const FAQ_DATA = [
  {
    question: 'How does food recognition work?',
    answer: 'Our app uses advanced AI technology to analyze images of food. When you take a photo of a food item, our system compares it to millions of food images in our database to identify the item and provide nutritional information. The more people use the app, the smarter it becomes!'
  },
  {
    question: 'How accurate is the nutritional information?',
    answer: 'We strive for high accuracy in our nutritional data, which comes from verified databases and is regularly updated. However, variations can occur based on specific brands, preparation methods, and portion sizes. For precise information, always check product packaging or consult with a nutritionist.'
  },
  {
    question: 'Can I scan packaged foods with barcodes?',
    answer: 'Yes! Our app supports barcode scanning for packaged foods. Simply use the "Scan Barcode" option in the scan screen, and we\'ll retrieve nutritional information from our extensive product database.'
  },
  {
    question: 'How do I track my daily nutrition intake?',
    answer: 'After scanning a food item, you can add it to your daily log. The app automatically calculates and tracks your calories, macronutrients, and micronutrients. You can view your daily, weekly, and monthly progress in the Stats tab.'
  },
  {
    question: 'Can I set dietary preferences and restrictions?',
    answer: 'Absolutely! Go to Settings > Dietary Preferences to set your diet type (vegan, keto, etc.), allergies, and food preferences. The app will customize recommendations and alerts based on your settings.'
  },
  {
    question: 'How do I get personalized meal recommendations?',
    answer: 'Complete your health profile and dietary preferences in the settings. Our algorithm uses this information along with your food history to suggest meals that match your nutritional needs and preferences.'
  },
  {
    question: 'Is my health data secure and private?',
    answer: 'Yes, we take your privacy seriously. All your health and personal data is encrypted and stored securely. We do not sell your personal information to third parties. You can read our full Privacy Policy for more details.'
  },
  {
    question: 'How do I sync my data across multiple devices?',
    answer: 'Create an account and sign in on all your devices. Your data will automatically sync across all devices when connected to the internet. You can manage sync settings in the Account section.'
  },
  {
    question: 'Can I export my nutrition data?',
    answer: 'Yes, you can export your nutrition data as CSV or PDF files. Go to Stats > Export Data to download your information. This is useful for sharing with healthcare providers or for your personal records.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'Subscriptions are managed through your app store account (Apple App Store or Google Play). Go to your app store account settings, find the subscription section, and cancel from there. Your premium features will remain active until the end of your billing period.'
  }
];

export default function HelpCenterScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery.trim() === '' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Toggle FAQ expansion
  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center</Text>
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
              <Ionicons name="help-circle" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Find answers to common questions or contact our support team
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Search Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Search for Help</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for help topics..."
                  placeholderTextColor={colors.textSecondary}
                />
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Frequently Asked Questions</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.faqContainer}>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.faqItem,
                        index < filteredFAQs.length - 1 && styles.faqItemBorder,
                        { borderBottomColor: colors.border + '50' }
                      ]}
                      onPress={() => toggleFAQ(index)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.faqHeader}>
                        <Text style={[styles.faqQuestion, { color: colors.text }]}>
                          {faq.question}
                        </Text>
                        <Ionicons 
                          name={expandedFAQs.includes(index) ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={colors.textSecondary} 
                        />
                      </View>
                      
                      {expandedFAQs.includes(index) && (
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                          {faq.answer}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                    No results found for "{searchQuery}". Try a different search term.
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Need More Help?</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.supportOptionsContainer}>
                <TouchableOpacity 
                  style={[styles.supportOption, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => router.push('/contact-us')}
                >
                  <Ionicons name="mail" size={28} color={colors.primary} style={styles.supportIcon} />
                  <Text style={[styles.supportOptionTitle, { color: colors.text }]}>
                    Contact Support
                  </Text>
                  <Text style={[styles.supportOptionDescription, { color: colors.textSecondary }]}>
                    Send us a message and we'll respond within 24 hours
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.supportOption, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {}}
                >
                  <Ionicons name="chatbubbles" size={28} color={colors.primary} style={styles.supportIcon} />
                  <Text style={[styles.supportOptionTitle, { color: colors.text }]}>
                    Live Chat
                  </Text>
                  <Text style={[styles.supportOptionDescription, { color: colors.textSecondary }]}>
                    Chat with our support team (Available 9am-5pm PST)
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.supportOption, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {}}
                >
                  <Ionicons name="book" size={28} color={colors.primary} style={styles.supportIcon} />
                  <Text style={[styles.supportOptionTitle, { color: colors.text }]}>
                    User Guide
                  </Text>
                  <Text style={[styles.supportOptionDescription, { color: colors.textSecondary }]}>
                    View our comprehensive user guide and tutorials
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            We're here to help you get the most out of Food Dictate.
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
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 36,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 10,
  },
  faqContainer: {
    paddingVertical: 8,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
  supportOptionsContainer: {
    paddingVertical: 8,
  },
  supportOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  supportIcon: {
    marginBottom: 12,
  },
  supportOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportOptionDescription: {
    fontSize: 14,
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
