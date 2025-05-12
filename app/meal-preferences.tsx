import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Storage key
const MEAL_PREFERENCES_KEY = '@FoodDictateApp:MealPreferences';

// Default meal preferences
const DEFAULT_PREFERENCES = {
  mealCount: 3,
  preferredCuisines: ['Italian', 'Mediterranean', 'Asian'],
  preferLowCarb: false,
  preferLowFat: false,
  preferHighProtein: false,
  preferGlutenFree: false,
  preferLowSodium: false,
  preferLowSugar: false,
  preferOrganicFood: false,
  preferLocalFood: false,
  preferHomeCooking: true,
  preferMealPrep: false,
};

// Available cuisines
const AVAILABLE_CUISINES = [
  'Italian', 'Mediterranean', 'Asian', 'Mexican', 'Indian', 
  'American', 'French', 'Greek', 'Japanese', 'Thai', 
  'Chinese', 'Middle Eastern', 'Spanish', 'Korean', 'Vietnamese'
];

interface MealPreferences {
  mealCount: number;
  preferredCuisines: string[];
  preferLowCarb: boolean;
  preferLowFat: boolean;
  preferHighProtein: boolean;
  preferGlutenFree: boolean;
  preferLowSodium: boolean;
  preferLowSugar: boolean;
  preferOrganicFood: boolean;
  preferLocalFood: boolean;
  preferHomeCooking: boolean;
  preferMealPrep: boolean;
}

export default function MealPreferencesScreen() {
  const { colors } = useTheme();
  const [preferences, setPreferences] = useState<MealPreferences>(DEFAULT_PREFERENCES);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedPreferences = await AsyncStorage.getItem(MEAL_PREFERENCES_KEY);
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Failed to load meal preferences:', error);
      }
    };
    loadPreferences();
  }, []);
  
  // Save preferences
  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem(MEAL_PREFERENCES_KEY, JSON.stringify(preferences));
      Alert.alert('Success', 'Your meal preferences have been saved.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save meal preferences:', error);
      Alert.alert('Error', 'Failed to save your meal preferences. Please try again.');
    }
  };
  
  // Toggle a boolean preference
  const togglePreference = (key: keyof MealPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Toggle cuisine selection
  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => {
      if (prev.preferredCuisines.includes(cuisine)) {
        return {
          ...prev,
          preferredCuisines: prev.preferredCuisines.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          preferredCuisines: [...prev.preferredCuisines, cuisine]
        };
      }
    });
  };
  
  // Set meal count
  const setMealCount = (count: number) => {
    setPreferences(prev => ({ ...prev, mealCount: count }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Meal Preferences</Text>
        <TouchableOpacity 
          onPress={isEditing ? savePreferences : () => setIsEditing(true)} 
          style={styles.editButton}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
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
              <Ionicons name="restaurant" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Customize your meal preferences for better recommendations
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Meal Count Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Meals Per Day</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.mealCountContainer}>
                {[2, 3, 4, 5, 6].map(count => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.mealCountButton,
                      preferences.mealCount === count && styles.selectedMealCount,
                      { 
                        borderColor: colors.border,
                        backgroundColor: preferences.mealCount === count ? colors.primary : 'transparent'
                      }
                    ]}
                    onPress={() => isEditing && setMealCount(count)}
                    disabled={!isEditing}
                  >
                    <Text 
                      style={[
                        styles.mealCountText, 
                        { 
                          color: preferences.mealCount === count ? '#fff' : colors.text 
                        }
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.mealCountDescription, { color: colors.textSecondary }]}>
                Select how many meals you typically eat per day
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Cuisine Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferred Cuisines</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.cuisinesContainer}>
                {AVAILABLE_CUISINES.map(cuisine => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.cuisineButton,
                      preferences.preferredCuisines.includes(cuisine) && styles.selectedCuisine,
                      { 
                        borderColor: colors.border,
                        backgroundColor: preferences.preferredCuisines.includes(cuisine) 
                          ? colors.primary + '20' 
                          : 'transparent'
                      }
                    ]}
                    onPress={() => isEditing && toggleCuisine(cuisine)}
                    disabled={!isEditing}
                  >
                    <Text 
                      style={[
                        styles.cuisineText, 
                        { 
                          color: preferences.preferredCuisines.includes(cuisine) 
                            ? colors.primary 
                            : colors.text 
                        }
                      ]}
                    >
                      {cuisine}
                    </Text>
                    {preferences.preferredCuisines.includes(cuisine) && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Dietary Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Dietary Preferences</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.preferencesContainer}>
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Low Carb</Text>
                  <Switch
                    value={preferences.preferLowCarb}
                    onValueChange={() => isEditing && togglePreference('preferLowCarb')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Low Fat</Text>
                  <Switch
                    value={preferences.preferLowFat}
                    onValueChange={() => isEditing && togglePreference('preferLowFat')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>High Protein</Text>
                  <Switch
                    value={preferences.preferHighProtein}
                    onValueChange={() => isEditing && togglePreference('preferHighProtein')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Gluten Free</Text>
                  <Switch
                    value={preferences.preferGlutenFree}
                    onValueChange={() => isEditing && togglePreference('preferGlutenFree')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Low Sodium</Text>
                  <Switch
                    value={preferences.preferLowSodium}
                    onValueChange={() => isEditing && togglePreference('preferLowSodium')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Low Sugar</Text>
                  <Switch
                    value={preferences.preferLowSugar}
                    onValueChange={() => isEditing && togglePreference('preferLowSugar')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Food Sourcing Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Food Sourcing</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.preferencesContainer}>
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Prefer Organic Food</Text>
                  <Switch
                    value={preferences.preferOrganicFood}
                    onValueChange={() => isEditing && togglePreference('preferOrganicFood')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Prefer Local Food</Text>
                  <Switch
                    value={preferences.preferLocalFood}
                    onValueChange={() => isEditing && togglePreference('preferLocalFood')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Prefer Home Cooking</Text>
                  <Switch
                    value={preferences.preferHomeCooking}
                    onValueChange={() => isEditing && togglePreference('preferHomeCooking')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
                
                <View style={styles.preferenceRow}>
                  <Text style={[styles.preferenceLabel, { color: colors.text }]}>Prefer Meal Prep</Text>
                  <Switch
                    value={preferences.preferMealPrep}
                    onValueChange={() => isEditing && togglePreference('preferMealPrep')}
                    disabled={!isEditing}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            These preferences will be used to customize your meal recommendations.
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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  mealCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mealCountButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMealCount: {
    borderWidth: 0,
  },
  mealCountText: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealCountDescription: {
    textAlign: 'center',
    fontSize: 14,
  },
  cuisinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cuisineButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCuisine: {
    borderWidth: 1,
  },
  cuisineText: {
    fontSize: 14,
  },
  checkIcon: {
    marginLeft: 4,
  },
  preferencesContainer: {
    paddingVertical: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
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
