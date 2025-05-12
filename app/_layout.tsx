import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MenuProvider } from 'react-native-popup-menu';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { useColorScheme } from '../hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import '../firebase';
import { Platform, StyleSheet, View } from 'react-native';
import ResponsiveContainer from '@/components/ResponsiveContainer';

export default function RootLayout() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoggedIn === false && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [pathname, isLoggedIn]);

  if (isLoggedIn === null) {
    return null; // or a loading spinner
  }

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.replace('/login');
  };

  const handleMenuSelect = async (value: string) => {
    if (value === 'logout') {
      await handleLogout();
    }
    // ...existing navigation logic
  };

  const isWeb = Platform.OS === 'web';

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <MenuProvider>
          <SafeAreaProvider>
            {isWeb ? (
              <View style={styles.webContainer}>
                <ResponsiveContainer>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="edit-profile" />
                    <Stack.Screen name="scan-results" />
                    <Stack.Screen name="nutrition-facts" />
                    <Stack.Screen name="similar-recipes" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                  </Stack>
                </ResponsiveContainer>
              </View>
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="scan-results" />
                <Stack.Screen name="nutrition-facts" />
                <Stack.Screen name="similar-recipes" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
              </Stack>
            )}
          </SafeAreaProvider>
        </MenuProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    width: '100%',
  },
});
