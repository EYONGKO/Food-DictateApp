import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Storage key
const ACTIVITY_LEVEL_KEY = '@FoodDictateApp:ActivityLevel';

// Activity levels
const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    description: 'Little or no exercise, desk job',
    icon: 'bed-outline',
    multiplier: 1.2,
    examples: 'Office work, driving, reading, watching TV'
  },
  {
    id: 'light',
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    icon: 'walk-outline',
    multiplier: 1.375,
    examples: 'Walking, light housework, golf, slow cycling'
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    icon: 'bicycle-outline',
    multiplier: 1.55,
    examples: 'Jogging, swimming, dancing, tennis, fast cycling'
  },
  {
    id: 'active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    icon: 'fitness-outline',
    multiplier: 1.725,
    examples: 'Running, HIIT workouts, sports training, heavy manual labor'
  },
  {
    id: 'extreme',
    title: 'Extremely Active',
    description: 'Very hard exercise & physical job',
    icon: 'barbell-outline',
    multiplier: 1.9,
    examples: 'Professional athletes, very heavy manual labor, twice daily training'
  }
];

export default function ActivityLevelScreen() {
  const { colors } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState('moderate');
  
  // Load saved activity level
  useEffect(() => {
    const loadActivityLevel = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem(ACTIVITY_LEVEL_KEY);
        if (savedLevel) {
          setSelectedLevel(savedLevel);
        }
      } catch (error) {
        console.error('Failed to load activity level:', error);
      }
    };
    loadActivityLevel();
  }, []);
  
  // Save activity level
  const saveActivityLevel = async (level: string) => {
    try {
      await AsyncStorage.setItem(ACTIVITY_LEVEL_KEY, level);
      setSelectedLevel(level);
      Alert.alert('Success', 'Your activity level has been updated.');
    } catch (error) {
      console.error('Failed to save activity level:', error);
      Alert.alert('Error', 'Failed to save your activity level. Please try again.');
    }
  };
  
  // Get selected activity level details
  const getSelectedLevelDetails = () => {
    return ACTIVITY_LEVELS.find(level => level.id === selectedLevel) || ACTIVITY_LEVELS[2];
  };
  
  // Calculate calorie adjustment
  const calculateCalorieAdjustment = () => {
    const selectedLevelDetails = getSelectedLevelDetails();
    return selectedLevelDetails.multiplier;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activity Level</Text>
        <View style={{ width: 40 }} />
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
              <Ionicons name="fitness" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Set your activity level to get accurate calorie recommendations
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Choose Your Activity Level</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {ACTIVITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.activityOption,
                    selectedLevel === level.id && styles.selectedOption,
                    { 
                      borderColor: selectedLevel === level.id ? colors.primary : colors.border,
                      backgroundColor: selectedLevel === level.id ? colors.primary + '15' : 'transparent'
                    }
                  ]}
                  onPress={() => saveActivityLevel(level.id)}
                >
                  <View style={styles.activityHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                      <Ionicons name={level.icon} size={24} color={colors.primary} />
                    </View>
                    <View style={styles.activityTitleContainer}>
                      <Text style={[styles.activityTitle, { color: colors.text }]}>{level.title}</Text>
                      <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                        {level.description}
                      </Text>
                    </View>
                    {selectedLevel === level.id && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </View>
                  
                  <Text style={[styles.activityExamples, { color: colors.textSecondary }]}>
                    Examples: {level.examples}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Calorie Adjustment</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.calorieAdjustment}>
                <Text style={[styles.calorieAdjustmentTitle, { color: colors.text }]}>
                  Your calorie needs are multiplied by:
                </Text>
                <Text style={[styles.calorieMultiplier, { color: colors.primary }]}>
                  {calculateCalorieAdjustment()}x
                </Text>
                <Text style={[styles.calorieAdjustmentDescription, { color: colors.textSecondary }]}>
                  This multiplier is applied to your basal metabolic rate (BMR) to determine your total daily energy expenditure.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Your activity level helps us calculate your daily calorie needs more accurately.
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
  activityOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderWidth: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTitleContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  activityExamples: {
    fontSize: 13,
    marginTop: 4,
    marginLeft: 52,
  },
  calorieAdjustment: {
    alignItems: 'center',
    padding: 16,
  },
  calorieAdjustmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  calorieMultiplier: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  calorieAdjustmentDescription: {
    fontSize: 14,
    textAlign: 'center',
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
