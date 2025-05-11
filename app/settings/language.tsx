import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

// Reuse or define COLORS
const COLORS = {
  primary: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#A0A0A0',
  lightGrey: '#f0f0f0',
  darkGrey: '#333333',
};

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    // Add more languages here
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const currentLanguage = i18n.language;

  const changeLanguage = (langCode: string) => {
    if (langCode !== currentLanguage) {
      console.log("Changing language to:", langCode);
      i18n.changeLanguage(langCode); // This will trigger detection cache
      // Optionally force reload or rely on component updates
      // router.replace('/settings'); // Go back after changing
    }
  };

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: theme.card }]}
      onPress={() => changeLanguage(item.code)}
    >
      <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
      {currentLanguage === item.code && (
        <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        {/* Translate title */}
        <Text style={styles.headerTitle}>{t('settings.language')}</Text>
        <View style={{ width: 40 }}/>{/* Spacer */}
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.primary, // Keep header primary
  },
   headerButton: {
     padding: 5,
   },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
      paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Use theme border color potentially
    borderBottomColor: '#cccccc',
  },
  label: {
    fontSize: 16,
  },
}); 