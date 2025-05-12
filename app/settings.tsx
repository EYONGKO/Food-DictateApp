// app/settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingItemType = 'navigation' | 'switch' | 'link' | 'action' | 'language';

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  type: SettingItemType;
  target?: string;
  action?: () => void;
  stateKey?: keyof SettingsState;
  value?: boolean;
  currentLanguage?: string;
}

interface SettingsSection {
  title: string;
  data: SettingItem[];
}

interface SettingsState {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

const getSettingsData = (
  theme: ReturnType<typeof useTheme>,
  toggleTheme: () => void,
  settingsState: SettingsState,
  toggleSetting: (key: keyof SettingsState) => void,
  currentLanguage: string,
  onLanguagePress: () => void
): SettingsSection[] => [
  {
    title: 'Quick Actions',
    data: [
      {
        icon: 'scan-outline',
        label: 'Scan Food',
        description: 'Scan food items to get nutritional information',
        type: 'navigation',
        target: '/(tabs)/scan'
      } as SettingItem,
      {
        icon: 'book-outline',
        label: 'Food Library',
        description: 'View your saved food items and history',
        type: 'navigation',
        target: '/(tabs)/library'
      } as SettingItem,
      {
        icon: 'restaurant-outline',
        label: 'Recipes',
        description: 'Browse and discover new recipes',
        type: 'navigation',
        target: '/(tabs)/recipes'
      } as SettingItem,
      {
        icon: 'nutrition-outline',
        label: 'Nutrition Facts',
        description: 'View detailed nutrition information',
        type: 'navigation',
        target: '/(tabs)/nutrition-facts'
      } as SettingItem
    ]
  },
  {
    title: 'Nutrition & Health',
    data: [
      {
        icon: 'fitness-outline',
        label: 'Daily Goals',
        description: 'Set your daily nutrition targets',
        type: 'navigation',
        target: '/nutrition-goals'
      } as SettingItem,
      {
        icon: 'body-outline',
        label: 'Health Profile',
        description: 'Manage your health information',
        type: 'navigation',
        target: '/health-profile'
      } as SettingItem,
      {
        icon: 'barbell-outline',
        label: 'Activity Level',
        description: 'Adjust your activity level settings',
        type: 'navigation',
        target: '/activity-level'
      } as SettingItem,
      {
        icon: 'water-outline',
        label: 'Water Intake',
        description: 'Track your daily water consumption',
        type: 'navigation',
        target: '/water-intake'
      } as SettingItem
    ]
  },
  {
    title: 'Dietary Preferences',
    data: [
      {
        icon: 'restaurant-outline',
        label: 'Meal Preferences',
        description: 'Customize your meal preferences',
        type: 'navigation',
        target: '/meal-preferences'
      } as SettingItem,
      {
        icon: 'warning-outline',
        label: 'Allergies & Restrictions',
        description: 'Manage your dietary restrictions',
        type: 'navigation',
        target: '/dietary-restrictions'
      } as SettingItem,
      {
        icon: 'leaf-outline',
        label: 'Diet Type',
        description: 'Set your diet type (vegan, keto, etc.)',
        type: 'navigation',
        target: '/diet-type'
      } as SettingItem,
      {
        icon: 'thumbs-down-outline',
        label: 'Food Exclusions',
        description: 'Foods you want to avoid',
        type: 'navigation',
        target: '/food-exclusions'
      } as SettingItem
    ]
  },
  {
    title: 'Account',
    data: [
      {
        icon: 'person-outline',
        label: 'Profile',
        description: 'View and edit your profile',
        type: 'navigation',
        target: '/(tabs)/profile'
      },
      {
        icon: 'key-outline',
        label: 'Change Password',
        description: 'Update your account password',
        type: 'navigation',
        target: '/change-password'
      },
      {
        icon: 'cloud-upload-outline',
        label: 'Sync Data',
        description: 'Sync your data across devices',
        type: 'action',
        action: () => Alert.alert('Sync', 'Your data has been synced successfully')
      },
      {
        icon: 'trash-outline',
        label: 'Clear Data',
        description: 'Delete all your saved data',
        type: 'action',
        action: () => Alert.alert(
          'Clear Data',
          'Are you sure you want to clear all your data? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: () => Alert.alert('Data Cleared', 'All your data has been cleared')
            }
          ]
        )
      }
    ]
  },
  {
    title: 'App Settings',
    data: [
      {
        icon: 'moon-outline',
        label: 'Dark Mode',
        description: 'Toggle dark mode on/off',
        type: 'switch',
        action: toggleTheme,
        value: theme.isDark
      },
      {
        icon: 'language-outline',
        label: 'Language',
        description: currentLanguage === 'en' ? 'English' : 'Français',
        type: 'language',
        action: onLanguagePress
      },
      {
        icon: 'speedometer-outline',
        label: 'Units',
        description: 'Set measurement units (metric/imperial)',
        type: 'navigation',
        target: '/settings/units'
      },
      {
        icon: 'color-palette-outline',
        label: 'Theme',
        description: 'Customize app appearance',
        type: 'navigation',
        target: '/theme-settings'
      }
    ]
  },
  {
    title: 'Notifications',
    data: [
      {
        icon: 'notifications-outline',
        label: 'Push Notifications',
        description: 'Receive push notifications',
        type: 'switch',
        stateKey: 'pushNotifications',
        value: settingsState.pushNotifications,
        action: () => toggleSetting('pushNotifications')
      },
      {
        icon: 'mail-outline',
        label: 'Email Notifications',
        description: 'Receive email updates',
        type: 'switch',
        stateKey: 'emailNotifications',
        value: settingsState.emailNotifications,
        action: () => toggleSetting('emailNotifications')
      },
      {
        icon: 'time-outline',
        label: 'Reminder Schedule',
        description: 'Set up meal and water reminders',
        type: 'navigation',
        target: '/reminder-schedule'
      },
      {
        icon: 'alert-circle-outline',
        label: 'Nutrition Alerts',
        description: 'Get alerts for nutrition goals',
        type: 'navigation',
        target: '/nutrition-alerts'
      }
    ]
  },
  {
    title: 'Support & Legal',
    data: [
      {
        icon: 'help-circle-outline',
        label: 'Help Center',
        description: 'Get help and support',
        type: 'navigation',
        target: '/help-center'
      },
      {
        icon: 'chatbubble-outline',
        label: 'Contact Us',
        description: 'Send us feedback or questions',
        type: 'navigation',
        target: '/contact-us'
      },
      {
        icon: 'document-text-outline',
        label: 'Terms of Service',
        description: 'Read our terms of service',
        type: 'navigation',
        target: '/terms-of-service'
      },
      {
        icon: 'shield-checkmark-outline',
        label: 'Privacy Policy',
        description: 'View our privacy policy',
        type: 'navigation',
        target: '/privacy-policy'
      }
    ]
  },
  {
    title: 'About',
    data: [
      {
        icon: 'information-circle-outline',
        label: 'App Version',
        description: 'v1.0.0',
        type: 'action',
        action: () => {}
      },
      {
        icon: 'star-outline',
        label: 'Rate the App',
        description: 'Leave a review on the app store',
        type: 'link',
        target: 'https://example.com/rate'
      },
      {
        icon: 'share-social-outline',
        label: 'Share App',
        description: 'Share with friends and family',
        type: 'action',
        action: () => Alert.alert('Share', 'Sharing functionality would be implemented here')
      }
    ]
  }
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [settingsState, setSettingsState] = useState<SettingsState>({
    pushNotifications: true,
    emailNotifications: true,
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettingsState(JSON.parse(savedSettings));
      }
      const savedLanguage = await AsyncStorage.getItem('@FoodDictateApp:Language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      await AsyncStorage.setItem('@FoodDictateApp:Language', lang);
      setShowLanguageModal(false);
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert('Error', 'Failed to change language');
    }
  };

  const toggleSetting = async (key: keyof SettingsState) => {
    const newState = {
      ...settingsState,
      [key]: !settingsState[key],
    };
    setSettingsState(newState);
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handlePress = (item: SettingItem) => {
    if (!item) return;

    switch (item.type) {
      case 'navigation':
        if (item.target) {
          router.push(item.target as any);
        }
        break;
      case 'link':
        if (item.target) {
          Linking.openURL(item.target);
        }
        break;
      case 'action':
        if (item.action) {
          item.action();
        }
        break;
      case 'switch':
        if (item.stateKey) {
          toggleSetting(item.stateKey);
        }
        break;
      case 'language':
        if (item.action) {
          item.action();
        }
        break;
    }
  };

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowLanguageModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Select Language
          </Text>
          <TouchableOpacity
            style={[
              styles.languageOption,
              currentLanguage === 'en' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[styles.languageText, { color: theme.colors.text }]}>
              English
            </Text>
            {currentLanguage === 'en' && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageOption,
              currentLanguage === 'fr' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => changeLanguage('fr')}
          >
            <Text style={[styles.languageText, { color: theme.colors.text }]}>
              Français
            </Text>
            {currentLanguage === 'fr' && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const settingsData = getSettingsData(
    theme,
    theme.toggleTheme,
    settingsState,
    toggleSetting,
    currentLanguage,
    () => setShowLanguageModal(true)
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <LinearGradient
            colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBannerGradient}
          >
            <View style={[styles.headerBannerContent, { backgroundColor: theme.colors.card + '99' }]}>
              <Ionicons name="settings" size={30} color={theme.colors.primary} />
              <Text style={[styles.headerBannerText, { color: theme.colors.text }]}>
                Customize your app experience
              </Text>
            </View>
          </LinearGradient>
        </View>

        {settingsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>

            <LinearGradient
              colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionGradient}
            >
              <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
                {section.data.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex < section.data.length - 1 && styles.settingItemBorder,
                      { borderBottomColor: theme.colors.border + '50' }
                    ]}
                    onPress={() => handlePress(item)}
                  >
                    <View style={styles.settingContent}>
                      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
                      </View>
                      <View style={styles.settingText}>
                        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                          {item.label}
                        </Text>
                        {item.description && (
                          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      {item.type === 'switch' && (
                        <Switch
                          value={item.value}
                          onValueChange={item.action}
                          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                          thumbColor={theme.colors.background}
                        />
                      )}
                      {(item.type === 'navigation' || item.type === 'link' || item.type === 'language') && (
                        <Ionicons
                          name="chevron-forward"
                          size={22}
                          color={theme.colors.textSecondary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Food Dictate App © 2023
          </Text>
        </View>
      </ScrollView>
      {renderLanguageModal()}
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
    fontSize: 24,
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
    overflow: 'hidden',
  },
  settingItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
      }
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
  },
});