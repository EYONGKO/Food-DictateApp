import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';

const LANGUAGES = {
  en,
  fr,
};

const LANG_CODES = Object.keys(LANGUAGES);
const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // 1. Try getting saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('@FoodDictateApp:Language');
      if (savedLanguage && LANG_CODES.includes(savedLanguage)) {
        console.log('Detected language from storage:', savedLanguage);
        return callback(savedLanguage);
      }

      // 2. Fallback to device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode;
      if (deviceLanguage && LANG_CODES.includes(deviceLanguage)) {
          console.log('Detected language from device:', deviceLanguage);
          return callback(deviceLanguage);
      }

      // 3. Default to English
       console.log('Defaulting language to English');
      return callback('en');

    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en'); // Default on error
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
       console.log('Caching language:', language);
      await AsyncStorage.setItem('@FoodDictateApp:Language', language);
    } catch (error) {
        console.error('Error caching language:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4', // Use v4 for latest compatibility
    resources: LANGUAGES,
    react: {
      useSuspense: false, // Important for react-native
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    fallbackLng: 'en', // Fallback language if detection fails
  });

export default i18n; 