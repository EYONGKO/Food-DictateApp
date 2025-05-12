import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

/**
 * A container component that centers content and limits width on larger screens
 * for better web experience while maintaining full width on mobile.
 */
export default function ResponsiveContainer({ 
  children, 
  style, 
  maxWidth = 1024 
}: ResponsiveContainerProps) {
  const { colors } = useTheme();
  
  // Only apply max width and centering on web platform
  const isWeb = Platform.OS === 'web';
  
  return (
    <View 
      style={[
        styles.container,
        isWeb && { 
          maxWidth, 
          marginHorizontal: 'auto',
          shadowColor: colors.text + '20',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
