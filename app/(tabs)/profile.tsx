import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import events from '../../utils/events';
import { LinearGradient } from 'expo-linear-gradient';
import { getUsers, addUser } from '../../utils/api';
import { getAuth } from 'firebase/auth';

// Storage keys
const LIBRARY_STORAGE_KEY = '@FoodDictateApp:Library';
const USER_PROFILE_STORAGE_KEY = '@FoodDictateApp:UserProfile';
const RECENT_SCANS_KEY = '@FoodDictateApp:RecentScans';
const DIETARY_PREFS_KEY = '@FoodDictateApp:DietaryPrefs';

// Define colors (or get entirely from theme)
const COLORS = {
  // Keep red for logout, or add theme.danger
  red: '#F44336',
};

// Profile data structure
interface UserProfile {
  name: string;
  email: string;
  imageUri?: string | null;
  dietaryPreferences?: string[];
  allergies?: string[];
}

interface RecentScan {
  id: string;
  foodName: string;
  timestamp: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Profile Info State
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("Loading...");
  const [userImageUri, setUserImageUri] = useState<string | null>(null);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  // Stats State
  const [scanCount, setScanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState([]);

  const primary = colors.primary || '#22C55E';

  const user = getAuth().currentUser;

  // Load profile data and stats on focus
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Load Profile Data
          const storedProfile = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
          if (isActive && storedProfile) {
            const profile: UserProfile = JSON.parse(storedProfile);
            setUserName(profile.name || "User Name");
            setUserEmail(profile.email || "user@example.com");
            setUserImageUri(profile.imageUri || null);
            setDietaryPrefs(profile.dietaryPreferences || []);
            setAllergies(profile.allergies || []);
          }

          // Load Recent Scans
          const storedScans = await AsyncStorage.getItem(RECENT_SCANS_KEY);
          if (isActive && storedScans) {
            const scans: RecentScan[] = JSON.parse(storedScans);
            setRecentScans(scans.slice(0, 5)); // Show last 5 scans
            setScanCount(scans.length);
          }

          // Load Library Count
          const storedItems = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
          if (isActive) {
            const items = storedItems ? JSON.parse(storedItems) : [];
            setSavedCount(items.length);
            // Assuming recipes are a subset of saved items with a recipe flag
            setRecipeCount(items.filter((item: any) => item.hasRecipe).length);
          }

        } catch (e) {
          console.error("Failed to load data for profile.", e);
          if (isActive) {
            setUserName("User");
            setUserEmail("Error loading email");
            setUserImageUri(null);
            setSavedCount(0);
            setScanCount(0);
            setRecipeCount(0);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadData();
      // Listen for profileDataChanged events
      const reload = () => loadData();
      events.on('profileDataChanged', reload);
      return () => {
        isActive = false;
        events.off('profileDataChanged', reload);
      };
    }, [])
  );

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleUnits = () => {
    router.push('/settings/units' as any);
  };

  const handleLanguage = () => {
    router.push('/settings/language' as any);
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('profile.logoutButton'),
          style: "destructive",
          onPress: () => {
            // TODO: Implement actual logout logic
            console.log("User logged out (Placeholder)");
          }
        },
      ]
    );
  };

  // Add delete handler for recent scans
  const handleDeleteRecentScan = async (scanId: string) => {
    try {
      const storedScans = await AsyncStorage.getItem(RECENT_SCANS_KEY);
      let scans: RecentScan[] = storedScans ? JSON.parse(storedScans) : [];
      scans = scans.filter(scan => scan.id !== scanId);
      await AsyncStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(scans));
      events.emit('profileDataChanged');
    } catch (e) {
      Alert.alert('Error', 'Failed to delete recent scan.');
    }
  };

  // Render recent scan item
  const renderRecentScan = (scan: RecentScan) => (
    <TouchableOpacity
      key={scan.id}
      style={[styles.recentScanItem, { backgroundColor: colors.card }]}
      onPress={() => router.push({ pathname: '/scan-results', params: { id: scan.id } })}
    >
      <View style={styles.recentScanContent}>
        <Text style={[styles.recentScanName, { color: colors.text }]} numberOfLines={1}>
          {scan.foodName}
        </Text>
        <Text style={[styles.recentScanTime, { color: colors.textSecondary }]}>
          {new Date(scan.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteRecentScan(scan.id)} style={{ marginLeft: 10 }}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  // Render Setting Row Helper
  const renderInfoRow = (labelKey: string, value: string | number) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t(labelKey)}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={{width: 40}}/>
        <Text style={[styles.headerTitle, { color: colors.background }]}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={handleSettings} style={[styles.headerButtonRight, { backgroundColor: colors.background }]}>
          <Ionicons name="settings-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        <View style={[styles.profileContainer, { backgroundColor: colors.card }]}>
          {/* Subtle primary tint overlay */}
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.primary + '10',
            zIndex: 0,
            borderRadius: 10,
          }} />
          <View style={{ zIndex: 1 }}>
            <TouchableOpacity onPress={handleEditProfile}>
              {userImageUri ? (
                <Image source={{ uri: userImageUri }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 32, color: '#888' }}>?</Text>
                </View>
              )}
              <View style={[styles.editIconOverlay, { backgroundColor: colors.primary + '80', borderColor: colors.background }]}>
                <Ionicons name="camera-outline" size={16} color={colors.background} />
              </View>
            </TouchableOpacity>
            <Text style={[styles.profileName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{scanCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.scansStat')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{savedCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.savedStat')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{recipeCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.recipesStat')}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Decorative Banner Section */}
        <View style={{
          backgroundColor: colors.primary + '22',
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 16,
          padding: 16,
          alignItems: 'center',
        }}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>
            Welcome to FOOD DICTATION!
          </Text>
        </View>
        {/* Gradient Bar Section */}
        <LinearGradient
          colors={[primary, '#A7F3D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 8,
            borderRadius: 8,
            marginHorizontal: 40,
            marginBottom: 16,
          }}
        />

        {/* Recent Scans Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('profile.recentScans')}
          </Text>
          {recentScans.length > 0 ? (
            recentScans.map(renderRecentScan)
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('profile.noRecentScans')}
            </Text>
          )}
        </View>

        {/* Dietary Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('profile.dietaryPreferences')}
          </Text>
          <View style={styles.preferencesContainer}>
            {dietaryPrefs.map((pref, index) => (
              <View
                key={index}
                style={[styles.preferenceTag, { backgroundColor: colors.primary + '20' }]}
              >
                <Text style={[styles.preferenceText, { color: colors.primary }]}>
                  {pref}
                </Text>
              </View>
            ))}
            {dietaryPrefs.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('profile.noDietaryPreferences')}
              </Text>
            )}
          </View>
        </View>

        {/* Allergies Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('profile.allergies')}
          </Text>
          <View style={styles.preferencesContainer}>
            {allergies.map((allergy, index) => (
              <View
                key={index}
                style={[styles.preferenceTag, { backgroundColor: colors.error + '20' }]}
              >
                <Text style={[styles.preferenceText, { color: colors.error }]}>
                  {allergy}
                </Text>
              </View>
            ))}
            {allergies.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('profile.noAllergies')}
              </Text>
            )}
          </View>
        </View>

        {/* Settings Info Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={handleEditProfile} style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Edit Profile</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          {renderInfoRow('profile.language', t('profile.languageValue'))}
          {renderInfoRow('profile.units', t('profile.unitsValue'))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]} onPress={handleLogout}>
          <Text style={[styles.logoutButtonText, { color: COLORS.red }]}>{t('profile.logoutButton')}</Text>
        </TouchableOpacity>

        {/* Account Information */}
        <LinearGradient
          colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionGradient}
        >
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Account Information
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="star" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Account Type</Text>
              </View>
              <View style={[styles.badgeContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>Premium</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="calendar" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Member Since</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>January 2025</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="time" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Login</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>{new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="mail" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Subscription Information */}
        <LinearGradient
          colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionGradient}
        >
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Subscription Details
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="calendar" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Next Billing</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>February 15, 2025</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="cash" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Plan</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>Annual ($79.99/year)</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => {}}
            >
              <Text style={styles.buttonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* App Information */}
        <LinearGradient
          colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionGradient}
        >
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                App Information
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="code" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>2.0.1</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="construct" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Build</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>2025.01.15</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <Ionicons name="globe" size={18} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Region</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>United States</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtonRight: {
    padding: 5,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 10,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionGradient: {
    marginHorizontal: 16,
    marginVertical: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentScanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  recentScanContent: {
    flex: 1,
    marginRight: 10,
  },
  recentScanName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  recentScanTime: {
    fontSize: 13,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 8,
  },
  preferenceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  logoutButton: {
    marginHorizontal: 10,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    overflow: 'hidden',
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
});