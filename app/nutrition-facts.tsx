import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

// Define nutrition data interface
interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  vitamins: {
    [key: string]: number;
  };
  minerals: {
    [key: string]: number;
  };
}

// Mock nutrition data generator based on food name
const generateNutritionData = (foodName: string): NutritionData => {
  // This is a simplified mock function that would be replaced with real API data
  const isHealthy = foodName.toLowerCase().includes('salad') ||
                    foodName.toLowerCase().includes('vegetable') ||
                    foodName.toLowerCase().includes('fruit');

  const isHighProtein = foodName.toLowerCase().includes('chicken') ||
                        foodName.toLowerCase().includes('beef') ||
                        foodName.toLowerCase().includes('fish');

  const isHighCarb = foodName.toLowerCase().includes('pasta') ||
                     foodName.toLowerCase().includes('rice') ||
                     foodName.toLowerCase().includes('bread');

  return {
    calories: isHealthy ? Math.floor(Math.random() * 200) + 100 : Math.floor(Math.random() * 500) + 300,
    protein: isHighProtein ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 15) + 5,
    carbs: isHighCarb ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30) + 10,
    fat: isHealthy ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 25) + 10,
    fiber: isHealthy ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 4) + 1,
    sugar: isHealthy ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 20) + 5,
    sodium: Math.floor(Math.random() * 500) + 100,
    cholesterol: isHighProtein ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 30) + 10,
    vitamins: {
      A: Math.floor(Math.random() * 100),
      C: isHealthy ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 20) + 5,
      D: Math.floor(Math.random() * 30) + 5,
      E: Math.floor(Math.random() * 40) + 10,
    },
    minerals: {
      Calcium: Math.floor(Math.random() * 30) + 5,
      Iron: Math.floor(Math.random() * 25) + 5,
      Potassium: isHealthy ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 8) + 2,
      Magnesium: Math.floor(Math.random() * 20) + 5,
    }
  };
};

export default function NutritionFactsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ foodName: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const caloriesAnim = useState(new Animated.Value(0))[0];
  const macrosAnim = useState(new Animated.Value(0))[0];
  const vitaminsAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Simulate API call to get nutrition data
    const loadNutritionData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use our mock generator
        if (!params.foodName) {
          throw new Error('No food name provided');
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = generateNutritionData(params.foodName);
        setNutritionData(data);

        // Start animations after data is loaded
        Animated.sequence([
          Animated.timing(caloriesAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(macrosAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(vitaminsAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();

      } catch (error) {
        console.error('Failed to load nutrition data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNutritionData();
  }, [params.foodName]);

  // Render nutrition bar with animation
  const renderNutritionBar = (value: number, maxValue: number, color: string, animValue: Animated.Value) => {
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: `${percentage}%`,
              opacity: animValue,
              transform: [
                {
                  scaleX: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            }
          ]}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Nutrition Facts</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading nutrition information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!nutritionData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Nutrition Facts</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.errorContainerGradient}
          >
            <LinearGradient
              colors={[colors.card, colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.errorContainer, { borderColor: 'transparent' }]}
            >
              <Ionicons name="alert-circle" size={48} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                Could not load nutrition information for {params.foodName || 'this food'}
              </Text>

              <TouchableOpacity style={styles.buttonContainer} onPress={() => router.back()}>
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Go Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nutrition Facts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.foodNameContainerGradient}
        >
          <LinearGradient
            colors={[colors.card, colors.card + '99']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.foodNameContainer, { borderColor: 'transparent' }]}
          >
            <Text style={[styles.foodName, { color: colors.text }]}>{params.foodName}</Text>
            <Text style={[styles.servingSize, { color: colors.textSecondary }]}>Serving Size: 100g</Text>
          </LinearGradient>
        </LinearGradient>

        {/* Calories Section */}
        <Animated.View
          style={[
            styles.nutritionSectionWrapper,
            {
              opacity: caloriesAnim,
              transform: [{ translateY: caloriesAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nutritionSectionGradient}
          >
            <LinearGradient
              colors={[colors.card, colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.nutritionSection, { borderColor: 'transparent' }]}
            >
              <View style={styles.caloriesContainer}>
                <Text style={[styles.caloriesTitle, { color: colors.text }]}>Calories</Text>
                <Text style={[styles.caloriesValue, { color: colors.primary }]}>{nutritionData.calories}</Text>
              </View>
              {renderNutritionBar(nutritionData.calories, 2000, colors.primary, caloriesAnim)}
              <Text style={[styles.dailyValue, { color: colors.textSecondary }]}>
                {Math.round((nutritionData.calories / 2000) * 100)}% of Daily Value
              </Text>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        {/* Macronutrients Section */}
        <Animated.View
          style={[
            styles.nutritionSectionWrapper,
            {
              opacity: macrosAnim,
              transform: [{ translateY: macrosAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nutritionSectionGradient}
          >
            <LinearGradient
              colors={[colors.card, colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.nutritionSection, { borderColor: 'transparent' }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Macronutrients</Text>

              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: colors.text }]}>Protein</Text>
                  <Text style={[styles.macroValue, { color: colors.text }]}>{nutritionData.protein}g</Text>
                </View>
                {renderNutritionBar(nutritionData.protein, 50, '#4CAF50', macrosAnim)}
              </View>

              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: colors.text }]}>Carbohydrates</Text>
                  <Text style={[styles.macroValue, { color: colors.text }]}>{nutritionData.carbs}g</Text>
                </View>
                {renderNutritionBar(nutritionData.carbs, 300, '#2196F3', macrosAnim)}

                <View style={styles.subMacroContainer}>
                  <View style={styles.subMacroItem}>
                    <Text style={[styles.subMacroName, { color: colors.textSecondary }]}>Fiber</Text>
                    <Text style={[styles.subMacroValue, { color: colors.textSecondary }]}>{nutritionData.fiber}g</Text>
                  </View>
                  <View style={styles.subMacroItem}>
                    <Text style={[styles.subMacroName, { color: colors.textSecondary }]}>Sugar</Text>
                    <Text style={[styles.subMacroValue, { color: colors.textSecondary }]}>{nutritionData.sugar}g</Text>
                  </View>
                </View>
              </View>

              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: colors.text }]}>Fat</Text>
                  <Text style={[styles.macroValue, { color: colors.text }]}>{nutritionData.fat}g</Text>
                </View>
                {renderNutritionBar(nutritionData.fat, 70, '#FFC107', macrosAnim)}
              </View>

              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: colors.text }]}>Sodium</Text>
                  <Text style={[styles.macroValue, { color: colors.text }]}>{nutritionData.sodium}mg</Text>
                </View>
                {renderNutritionBar(nutritionData.sodium, 2300, '#FF5722', macrosAnim)}
              </View>

              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: colors.text }]}>Cholesterol</Text>
                  <Text style={[styles.macroValue, { color: colors.text }]}>{nutritionData.cholesterol}mg</Text>
                </View>
                {renderNutritionBar(nutritionData.cholesterol, 300, '#9C27B0', macrosAnim)}
              </View>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        {/* Vitamins & Minerals Section */}
        <Animated.View
          style={[
            styles.nutritionSectionWrapper,
            {
              opacity: vitaminsAnim,
              transform: [{ translateY: vitaminsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nutritionSectionGradient}
          >
            <LinearGradient
              colors={[colors.card, colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.nutritionSection, { borderColor: 'transparent' }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Vitamins & Minerals</Text>

              <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>Vitamins</Text>
              {Object.entries(nutritionData.vitamins).map(([vitamin, value]) => (
                <View key={`vitamin-${vitamin}`} style={styles.microItem}>
                  <View style={styles.microHeader}>
                    <Text style={[styles.microName, { color: colors.text }]}>Vitamin {vitamin}</Text>
                    <Text style={[styles.microValue, { color: colors.text }]}>{value}%</Text>
                  </View>
                  {renderNutritionBar(value, 100, '#8BC34A', vitaminsAnim)}
                </View>
              ))}

              <Text style={[styles.subsectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>Minerals</Text>
              {Object.entries(nutritionData.minerals).map(([mineral, value]) => (
                <View key={`mineral-${mineral}`} style={styles.microItem}>
                  <View style={styles.microHeader}>
                    <Text style={[styles.microName, { color: colors.text }]}>{mineral}</Text>
                    <Text style={[styles.microValue, { color: colors.text }]}>{value}%</Text>
                  </View>
                  {renderNutritionBar(value, 100, '#00BCD4', vitaminsAnim)}
                </View>
              ))}
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainerGradient: {
    width: '90%',
    borderRadius: 15,
    padding: 2,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  errorContainer: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  foodNameContainerGradient: {
    width: '100%',
    borderRadius: 15,
    padding: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  foodNameContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 15,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  servingSize: {
    fontSize: 14,
    marginTop: 4,
  },
  nutritionSectionWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  nutritionSectionGradient: {
    width: '100%',
    borderRadius: 15,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  nutritionSection: {
    width: '100%',
    padding: 16,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  caloriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caloriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dailyValue: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  barContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 16,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  subMacroContainer: {
    marginTop: 8,
    marginLeft: 16,
  },
  subMacroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subMacroName: {
    fontSize: 14,
  },
  subMacroValue: {
    fontSize: 14,
  },
  microItem: {
    marginBottom: 12,
  },
  microHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  microName: {
    fontSize: 14,
    fontWeight: '500',
  },
  microValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    marginTop: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});