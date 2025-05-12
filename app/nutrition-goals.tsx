import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

// Storage key
const NUTRITION_GOALS_KEY = '@FoodDictateApp:NutritionGoals';

// Default goals
const DEFAULT_GOALS = {
  calories: 2000,
  protein: 50, // grams
  carbs: 250, // grams
  fat: 70, // grams
  fiber: 25, // grams
  sugar: 50, // grams
  sodium: 2300, // mg
};

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export default function NutritionGoalsScreen() {
  const { colors } = useTheme();
  const [goals, setGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved goals
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const savedGoals = await AsyncStorage.getItem(NUTRITION_GOALS_KEY);
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
      } catch (error) {
        console.error('Failed to load nutrition goals:', error);
      }
    };
    loadGoals();
  }, []);

  // Save goals
  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem(NUTRITION_GOALS_KEY, JSON.stringify(goals));
      Alert.alert('Success', 'Your nutrition goals have been saved.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save nutrition goals:', error);
      Alert.alert('Error', 'Failed to save your nutrition goals. Please try again.');
    }
  };

  // Reset to default goals
  const resetToDefault = () => {
    Alert.alert(
      'Reset to Default',
      'Are you sure you want to reset all nutrition goals to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setGoals(DEFAULT_GOALS);
            setIsEditing(true);
          }
        }
      ]
    );
  };

  // Handle input change
  const handleChange = (name: keyof NutritionGoals, value: string) => {
    const numValue = parseInt(value) || 0;
    setGoals(prev => ({ ...prev, [name]: numValue }));
  };

  // Handle slider change
  const handleSliderChange = (name: keyof NutritionGoals, value: number) => {
    setGoals(prev => ({ ...prev, [name]: Math.round(value) }));
  };

  // Render a goal item
  const renderGoalItem = (
    name: keyof NutritionGoals, 
    label: string, 
    unit: string, 
    min: number, 
    max: number
  ) => {
    const value = goals[name];
    
    return (
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={[styles.goalLabel, { color: colors.text }]}>{label}</Text>
          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={value.toString()}
                onChangeText={(text) => handleChange(name, text)}
                keyboardType="numeric"
              />
              <Text style={[styles.unitText, { color: colors.textSecondary }]}>{unit}</Text>
            </View>
          ) : (
            <Text style={[styles.goalValue, { color: colors.primary }]}>
              {value} {unit}
            </Text>
          )}
        </View>
        
        {isEditing && (
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            value={value}
            onValueChange={(val) => handleSliderChange(name, val)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Nutrition Goals</Text>
        <TouchableOpacity 
          onPress={isEditing ? saveGoals : () => setIsEditing(true)} 
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
              <Ionicons name="fitness" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Set your daily nutrition targets
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.section}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {renderGoalItem('calories', 'Calories', 'kcal', 1000, 4000)}
              {renderGoalItem('protein', 'Protein', 'g', 10, 200)}
              {renderGoalItem('carbs', 'Carbohydrates', 'g', 50, 500)}
              {renderGoalItem('fat', 'Fat', 'g', 10, 200)}
              {renderGoalItem('fiber', 'Fiber', 'g', 5, 50)}
              {renderGoalItem('sugar', 'Sugar', 'g', 0, 100)}
              {renderGoalItem('sodium', 'Sodium', 'mg', 500, 5000)}
            </View>
          </LinearGradient>
        </View>
        
        {isEditing && (
          <TouchableOpacity 
            style={[styles.resetButton, { borderColor: colors.error }]} 
            onPress={resetToDefault}
          >
            <Text style={[styles.resetButtonText, { color: colors.error }]}>
              Reset to Default Values
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            These goals will be used to track your daily nutrition progress.
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
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
