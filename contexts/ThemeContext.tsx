import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  error: string;
  card: string;
  textSecondary: string;
  border: string;
  iconBackground: string;
  // Add other colors as needed
}

export interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  error: '#FF3B30',
  card: '#F2F2F7',
  textSecondary: '#6C6C6C',
  border: '#E5E5EA',
  iconBackground: '#F2F2F7'
};

export const darkTheme: ThemeColors = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#0A84FF',
  error: '#FF453A',
  card: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#38383A',
  iconBackground: '#2C2C2E'
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? darkTheme : lightTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 