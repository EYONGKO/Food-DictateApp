// app/settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

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
        icon: 'stats-chart-outline',
        label: 'Nutrition Stats',
        description: 'View your nutrition statistics and progress',
        type: 'navigation',
        target: '/(tabs)/stats'
      } as SettingItem
    ]
  },
  {
    title: 'Nutrition Facts',
    data: [
      {
        icon: 'nutrition-outline',
        label: 'Daily Goals',
        description: 'Set your daily nutrition targets',
        type: 'navigation',
        target: '/nutrition-goals'
      } as SettingItem,
      {
        icon: 'fitness-outline',
        label: 'Activity Level',
        description: 'Adjust your activity level settings',
        type: 'navigation',
        target: '/activity-level'
      } as SettingItem,
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
        type: 'navigation',
        target: '/change-password'
      }
    ]
  },
  {
    title: 'Preferences',
    data: [
      {
        icon: 'moon-outline',
        label: 'Dark Mode',
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
      }
    ]
  },
  {
    title: 'Notifications',
    data: [
      {
        icon: 'notifications-outline',
        label: 'Push Notifications',
        type: 'switch',
        stateKey: 'pushNotifications',
        value: settingsState.pushNotifications,
        action: () => toggleSetting('pushNotifications')
      },
      {
        icon: 'mail-outline',
        label: 'Email Notifications',
        type: 'switch',
        stateKey: 'emailNotifications',
        value: settingsState.emailNotifications,
        action: () => toggleSetting('emailNotifications')
      }
    ]
  },
  {
    title: 'Support',
    data: [
      {
        icon: 'help-circle-outline',
        label: 'Help Center',
        type: 'link',
        target: 'https://help.example.com'
      },
      {
        icon: 'document-text-outline',
        label: 'Terms of Service',
        type: 'link',
        target: 'https://example.com/terms'
      },
      {
        icon: 'shield-checkmark-outline',
        label: 'Privacy Policy',
        type: 'link',
        target: 'https://example.com/privacy'
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Settings</Text>
      <ScrollView style={styles.scrollView}>
        {settingsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>
            {section.data.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
                onPress={() => handlePress(item)}
              >
                <View style={styles.settingContent}>
                  <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
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
                      size={24}
                      color={theme.colors.textSecondary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      {renderLanguageModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '400',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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