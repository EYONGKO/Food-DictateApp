import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, ViewStyle, TextStyle, FlexAlignType, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Assuming you have Ionicons installed or replace with your icon library
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
// Import dropdown components
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { getRecentScans, RecentScan } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import events from '@/utils/events';
import { LinearGradient } from 'expo-linear-gradient';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { commonWebStyles, createWebStyles } from '@/utils/webStyles';

// Import Lottie for native platforms only
import LottieView from 'lottie-react-native';
const fireAnimation = require('../../assets/images/Animation - 1746832367326.json');

// Placeholder data - replace with actual data fetching
const recentScansData = [
  { id: '1', name: 'Homemade Pasta', ingredients: 8, date: 'Yesterday', icon: 'restaurant-outline' },
  { id: '2', name: 'Caesar Salad', ingredients: 5, date: '2 days ago', icon: 'leaf-outline' },
];

// Placeholder colors for Discover cards - ideally move to theme
const DISCOVER_COLORS = {
  lightPink: '#FEF0F0',
  lightBlue: '#22C55E',
};

// --- Menu Items Definition ---
const menuItems = [
  { value: 'index', icon: 'home-outline' as keyof typeof Ionicons.glyphMap, label: 'Home' },
  { value: 'scan', icon: 'scan-outline' as keyof typeof Ionicons.glyphMap, label: 'Scan' },
  { value: 'library', icon: 'library-outline' as keyof typeof Ionicons.glyphMap, label: 'Library' },
  { value: 'profile', icon: 'person-circle-outline' as keyof typeof Ionicons.glyphMap, label: 'Profile' },
  { value: 'settings', icon: 'settings-outline' as keyof typeof Ionicons.glyphMap, label: 'Settings', isDividerTop: true },
  { value: 'logout', icon: 'log-out-outline' as keyof typeof Ionicons.glyphMap, label: 'Logout', isDividerTop: true },
];
// ---------------------------

// --- Styles ---
// Define base styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 15 : 10, // Adjust padding for Android status bar
    paddingBottom: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 10,
    paddingBottom: 30, // More space at the bottom
    ...(Platform.OS === 'web' ? {
      maxWidth: '100%',
    } : {}),
  },
  welcomeCard: {
    borderRadius: 18,
    padding: 12,
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600', // Slightly bolder
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    marginBottom: 20, // More space before button
    textAlign: 'center',
  },
  scanButtonContainer: {
    marginTop: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  scanButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 0,
    ...(Platform.OS !== 'web' ? {
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    } : {
      boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)'
    }),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionContainer: {
    marginTop: 20, // Consistent margin top
    marginBottom: 10, // Space below section
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentItemBase: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 12, // Adjust padding
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  itemIconContainer: {
    width: 36, // Slightly smaller icon container
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15, // Slightly smaller
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
  },
  discoverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -5, // Counteract card margin
    ...(Platform.OS === 'web' ? {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
    } : {}),
  },
  discoverCardLink: {
     flex: 1,
     marginHorizontal: 5, // Space between cards
     ...(Platform.OS === 'web' ? {
       margin: 0,
       transition: 'transform 0.2s ease',
       ':hover': {
         transform: 'translateY(-4px)',
       }
     } : {}),
  },
  discoverCardBase: {
     borderRadius: 15,
     padding: 15,
     alignItems: 'center',
     height: 150, // Keep height or adjust as needed
     justifyContent: 'center',
     width: '100%',
  },
  discoverIconContainer: {
     marginBottom: 15,
  },
  discoverText: {
    fontSize: 14,
    fontWeight: '600', // Bolder
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  menuOptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuOptionIcon: {
    marginRight: 12,
  },
  menuOptionText: {
    fontSize: 16,
  },
  profileButton: {
    padding: 5,
  },
  welcomeDiscover: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 15,
    letterSpacing: 0.5,
    lineHeight: 20,
    width: '100%',
    alignSelf: 'center',
  },
});

// Combine styles in the component
export default function HomeScreen() {
  const userName = "Alex"; // Placeholder
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

  const fireFallAnim = useRef(new Animated.Value(0)).current;
  const firePulseAnim = useRef(new Animated.Value(1)).current;
  const flowerFallAnim = useRef(new Animated.Value(0)).current;
  const flowerFallAnim2 = useRef(new Animated.Value(0)).current;
  const flowerFallAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRecentScans();
    // Fire falls down with more dramatic bounce
    Animated.timing(fireFallAnim, {
      toValue: 20, // Adjusted fall distance
      duration: 1500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();

    // Add pulsating effect to fire
    Animated.loop(
      Animated.sequence([
        Animated.timing(firePulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(firePulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Flower falls down
    Animated.loop(
      Animated.timing(flowerFallAnim, {
        toValue: 80, // Increased fall distance
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    // Second flower with delay
    setTimeout(() => {
      Animated.loop(
        Animated.timing(flowerFallAnim2, {
          toValue: 80,
          duration: 2200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, 400);
    // Third flower with more delay
    setTimeout(() => {
      Animated.loop(
        Animated.timing(flowerFallAnim3, {
          toValue: 80,
          duration: 2400,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, 800);
  }, []);



  const flowerTranslateY = flowerFallAnim.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 80],
  });
  const flowerTranslateY2 = flowerFallAnim2.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 80],
  });
  const flowerTranslateY3 = flowerFallAnim3.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 80],
  });

  const loadRecentScans = async () => {
    try {
      const scans = await getRecentScans();
      setRecentScans(scans);
    } catch (error) {
      console.error('Error loading recent scans:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return 'just now';
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }

      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  // --- Platform-specific Style Definitions ---
  const nativeRecentItemStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Slightly less opacity
    shadowRadius: 3,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  };

  // Enhanced web styles with hover effects and better shadows
  const webRecentItemStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
    }
  };

  const webDiscoverCardStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-3px)',
    }
  };

  // Web-specific grid layout for discover cards
  const webGridStyles = createWebStyles({
    discoverGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
      width: '100%',
    }
  });
  // ----------------------------------------

  // --- Combined Styles ---
  const recentItemCombinedStyle = StyleSheet.flatten([
      styles.recentItemBase,
      { backgroundColor: colors.card, borderColor: colors.border },
      Platform.OS !== 'web' ? nativeRecentItemStyle : webRecentItemStyle // Use web style for web
  ]);

  const discoverCardCombinedStyle = StyleSheet.flatten([
       styles.discoverCardBase,
       Platform.OS === 'web' ? webDiscoverCardStyle : {}
   ]);
  // -----------------------

  // --- Navigation Handlers ---
  type TabPath = '/(tabs)/home' | '/(tabs)/scan' | '/(tabs)/library' | '/(tabs)/profile';

  const handleMenuSelect = async (value: string) => {
    if (value === 'logout') {
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('/login');
      return;
    }
    if (value === 'settings') {
      router.push('/settings' as const);
    } else {
      // Map menu values to their corresponding tab routes
      const tabRoutes = {
        scan: '/(tabs)/scan',
        library: '/(tabs)/library',
        profile: '/(tabs)/profile'
      } as const;
      const path = tabRoutes[value as keyof typeof tabRoutes];
      if (path) {
        router.replace(path);
      }
    }
  };

  // Add delete handler for recent scans
  const RECENT_SCANS_KEY = '@food_dictate:recent_scans';
  const handleDeleteRecentScan = async (scanId: string) => {
    try {
      const storedScans = await AsyncStorage.getItem(RECENT_SCANS_KEY);
      let scans = storedScans ? JSON.parse(storedScans) : [];
      scans = scans.filter(scan => scan.id !== scanId);
      await AsyncStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(scans));
      events.emit('profileDataChanged');
      setRecentScans(scans);
    } catch (e) {
      Alert.alert('Error', 'Failed to delete recent scan.');
    }
  };

  const renderRecentScans = () => {
    if (recentScans.length === 0) {
      return (
        <View style={[styles.recentItemBase, { backgroundColor: colors.card }]}>
          <Text style={[styles.itemName, { color: colors.textSecondary }]}>
            No recent scans
          </Text>
        </View>
      );
    }

    return recentScans.map((scan) => (
      <TouchableOpacity
        key={scan.id}
        style={[
          styles.recentItemBase,
          { backgroundColor: colors.card },
          Platform.OS === 'web' ? webRecentItemStyle : nativeRecentItemStyle,
        ]}
        onPress={() => router.push({
          pathname: '/scan-results',
          params: {
            imageUri: scan.imageUri,
            foodName: scan.name,
            ingredients: JSON.stringify(scan.ingredients),
            fromRecent: 'true'
          }
        })}
      >
        <View style={[styles.itemIconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
            {scan.name}
          </Text>
          <Text style={[styles.itemDetails, { color: colors.textSecondary }]}>
            {scan.ingredients.length} ingredients • {formatDate(scan.date)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteRecentScan(scan.id)} style={{ marginLeft: 10 }}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    ));
  };

  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        {/* --- Menu Dropdown --- */}
        <Menu onSelect={handleMenuSelect}>
          <MenuTrigger style={styles.headerButton}>
            <Ionicons name="menu-outline" size={28} color={colors.background} />
          </MenuTrigger>
          <MenuOptions>
            {menuItems.map((item) => (
              <React.Fragment key={item.value}>
                {item.isDividerTop && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <MenuOption value={item.value}>
                  <View style={styles.menuOptionWrapper}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.value === 'logout' ? colors.error : colors.textSecondary}
                      style={styles.menuOptionIcon}
                    />
                    <Text style={[styles.menuOptionText, { color: item.value === 'logout' ? colors.error : colors.text }]}>{item.label}</Text>
                  </View>
                </MenuOption>
              </React.Fragment>
            ))}
          </MenuOptions>
        </Menu>
        {/* ------------------- */}

        <Text style={[styles.headerTitle, { color: colors.background }]}>Food Dictation 2025</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.replace('/(tabs)/profile')}
        >
          <Ionicons name="person-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          isWeb && { paddingHorizontal: 16 }
        ]}
      >
        {isWeb ? (
          <ResponsiveContainer>
            <View>
              {/* Welcome Card */}
              <LinearGradient
              colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 2,
                width: isWeb ? '100%' : '88%',
                alignSelf: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
                marginTop: 25,
                marginBottom: 15,
              }}>
           <LinearGradient
             colors={[colors.card, colors.card + '99']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
             style={[styles.welcomeCard, { borderColor: 'transparent' }]}
           >
           {/* Animated fire and rotating MATCH FIRE */}
           <Animated.View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 0 }}>
             <Animated.View style={{
               backgroundColor: 'rgba(255, 214, 0, 0.15)',
               borderRadius: 40,
               padding: 5,
               marginBottom: 2,
               transform: [{ scale: firePulseAnim }],
             }}>
               {Platform.OS === 'web' ? (
                 // Web-specific implementation
                 <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                   <Text style={{ fontSize: 30 }}>🔥</Text>
                 </View>
               ) : (
                 // Native implementation
                 <LottieView
                   source={fireAnimation}
                   autoPlay
                   loop
                   style={{ width: 60, height: 60 }}
                 />
               )}
             </Animated.View>
             <Animated.Text
               style={{
                 fontSize: 24,
                 marginBottom: 0,
                 transform: [{ translateY: fireFallAnim }],
               }}
             >
               {/* 🔥 emoji removed, replaced by Lottie animation */}
             </Animated.Text>

             <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', height: 50, marginBottom: -5, zIndex: 10 }}>
               <Animated.Text
                 style={{
                   fontSize: 28,
                   transform: [{ translateY: flowerTranslateY }],
                   marginHorizontal: 5,
                 }}
               >
                 🌸
               </Animated.Text>
               <Animated.Text
                 style={{
                   fontSize: 28,
                   transform: [{ translateY: flowerTranslateY2 }],
                   marginHorizontal: 5,
                 }}
               >
                 🌸
               </Animated.Text>
               <Animated.Text
                 style={{
                   fontSize: 28,
                   transform: [{ translateY: flowerTranslateY3 }],
                   marginHorizontal: 5,
                 }}
               >
                 🌸
               </Animated.Text>
             </View>
           </Animated.View>
           <View style={{ marginTop: -15 }}>
             <Text
               style={[
                 styles.welcomeDiscover,
                 {
                   color: colors.primary,
                   textAlign: 'center',
                 }
               ]}
             >
               What would you like to discover today?
             </Text>
           </View>
           <TouchableOpacity
             style={styles.scanButtonContainer}
             onPress={() => router.replace('/(tabs)/scan')}
           >
             <LinearGradient
               colors={[colors.primary, colors.primary + 'CC']}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={[
                 styles.scanButton,
                 {
                   shadowColor: colors.primary,
                   paddingVertical: 14,
                   paddingHorizontal: 35
                 }
               ]}
             >
               <Text style={[styles.scanButtonText, { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }]}>QUICK SCAN</Text>
             </LinearGradient>
           </TouchableOpacity>
           </LinearGradient>
         </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.discoverContainer}>
            <Link href="/(tabs)/scan" asChild style={styles.discoverCardLink}>
              <TouchableOpacity style={styles.scanButtonContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.scanButton,
                    {
                      shadowColor: colors.primary,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }
                  ]}
                >
                  <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                  <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>SCAN FOOD</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/library" asChild style={styles.discoverCardLink}>
              <TouchableOpacity style={styles.scanButtonContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.scanButton,
                    {
                      shadowColor: colors.primary,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }
                  ]}
                >
                  <Ionicons name="library-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                  <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>LIBRARY</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>New Recent Scan</Text>
          {renderRecentScans()}
        </View>

        {/* Discover Recipes */}
        <View style={styles.sectionContainer}>
          {/* Hardcode section title */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover Recipes</Text>
          <View style={styles.discoverContainer}>
            <Link href={"/similar-recipes" as any} asChild style={styles.discoverCardLink}>
              <TouchableOpacity style={styles.scanButtonContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.scanButton,
                    {
                      shadowColor: colors.primary,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }
                  ]}
                >
                  <Ionicons name="flame-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                  <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>SIMILAR RECIPES</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
            <Link href={"/nutrition-facts" as any} asChild style={styles.discoverCardLink}>
              <TouchableOpacity style={styles.scanButtonContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.scanButton,
                    {
                      shadowColor: colors.primary,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }
                  ]}
                >
                  <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                  <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>NUTRITION FACTS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
          </View>
        </ResponsiveContainer>
        ) : (
          /* Non-web content - same content without ResponsiveContainer */
          <View>
            {/* Welcome Card */}
            <LinearGradient
              colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 2,
                width: '88%',
                alignSelf: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
                marginTop: 25,
                marginBottom: 15,
              }}>
              <LinearGradient
                colors={[colors.card, colors.card + '99']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.welcomeCard, { borderColor: 'transparent' }]}
              >
                {/* Content is the same as in the web version */}
                <View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 0 }}>
                  <View style={{
                    backgroundColor: 'rgba(255, 214, 0, 0.15)',
                    borderRadius: 40,
                    padding: 5,
                    marginBottom: 2,
                  }}>
                    <LottieView
                      source={fireAnimation}
                      autoPlay
                      loop
                      style={{ width: 60, height: 60 }}
                    />
                  </View>
                </View>
                <View style={{ marginTop: -15 }}>
                  <Text
                    style={[
                      styles.welcomeDiscover,
                      {
                        color: colors.primary,
                        textAlign: 'center',
                      }
                    ]}
                  >
                    What would you like to discover today?
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.scanButtonContainer}
                  onPress={() => router.replace('/(tabs)/scan')}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primary + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.scanButton,
                      {
                        shadowColor: colors.primary,
                        paddingVertical: 14,
                        paddingHorizontal: 35
                      }
                    ]}
                  >
                    <Text style={[styles.scanButtonText, { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }]}>QUICK SCAN</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>

            {/* Quick Actions */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
              <View style={styles.discoverContainer}>
                <Link href="/(tabs)/scan" asChild style={styles.discoverCardLink}>
                  <TouchableOpacity style={styles.scanButtonContainer}>
                    <LinearGradient
                      colors={[colors.primary, colors.primary + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.scanButton,
                        {
                          shadowColor: colors.primary,
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }
                      ]}
                    >
                      <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                      <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>SCAN FOOD</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
                <Link href="/(tabs)/library" asChild style={styles.discoverCardLink}>
                  <TouchableOpacity style={styles.scanButtonContainer}>
                    <LinearGradient
                      colors={[colors.primary, colors.primary + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.scanButton,
                        {
                          shadowColor: colors.primary,
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }
                      ]}
                    >
                      <Ionicons name="library-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                      <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>LIBRARY</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Recent Scans */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>New Recent Scan</Text>
              {renderRecentScans()}
            </View>

            {/* Discover Recipes */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover Recipes</Text>
              <View style={styles.discoverContainer}>
                <Link href={"/similar-recipes" as any} asChild style={styles.discoverCardLink}>
                  <TouchableOpacity style={styles.scanButtonContainer}>
                    <LinearGradient
                      colors={[colors.primary, colors.primary + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.scanButton,
                        {
                          shadowColor: colors.primary,
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }
                      ]}
                    >
                      <Ionicons name="flame-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                      <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>SIMILAR RECIPES</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
                <Link href={"/nutrition-facts" as any} asChild style={styles.discoverCardLink}>
                  <TouchableOpacity style={styles.scanButtonContainer}>
                    <LinearGradient
                      colors={[colors.primary, colors.primary + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.scanButton,
                        {
                          shadowColor: colors.primary,
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }
                      ]}
                    >
                      <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
                      <Text style={[styles.scanButtonText, { color: '#FFFFFF' }]}>NUTRITION FACTS</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom styles for the popup menu options (Refined & Typed)
interface MenuStyles {
    optionsContainer: ViewStyle;
    optionWrapper: ViewStyle;
    optionIcon: TextStyle; // Icon style can be text style
    optionText: TextStyle;
    divider: ViewStyle;
}

const menuOptionsStyles = (theme: any): MenuStyles => ({
    optionsContainer: {
        backgroundColor: theme.card,
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 8,
        marginTop: Platform.OS === 'ios' ? 45 : 50,
        marginLeft: 5,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: theme.isDarkMode ? 0.2 : 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    optionWrapper: {
        flexDirection: 'row', // Use literal type
        alignItems: 'center' as FlexAlignType, // Use literal type and assertion
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        color: theme.text,
        fontSize: 16,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.border,
        marginVertical: 6,
        marginHorizontal: 5,
  },
});
