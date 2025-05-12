import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import NutritionFacts from '../components/NutritionFacts';
import { getLastScanResult, ScanResultWithNutrition } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function NutritionFactsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lastScanResult, setLastScanResult] = useState<ScanResultWithNutrition | null>(null);

  // Initial nutrition data with all values set to zero
  const initialNutritionData = {
    servingSize: "1 serving",
    servingSizeGrams: 100,
    servingsPerContainer: 1,
    calories: 0,
    nutrients: {
      totalFat: { value: 0, unit: "g", dailyValue: 0 },
      saturatedFat: { value: 0, unit: "g", dailyValue: 0 },
      transFat: { value: 0, unit: "g" },
      cholesterol: { value: 0, unit: "mg", dailyValue: 0 },
      sodium: { value: 0, unit: "mg", dailyValue: 0 },
      totalCarbohydrate: { value: 0, unit: "g", dailyValue: 0 },
      dietaryFiber: { value: 0, unit: "g", dailyValue: 0 },
      addedSugars: { value: 0, unit: "g", dailyValue: 0 },
      protein: { value: 0, unit: "g" },
      vitaminD: { value: 0, unit: "mcg", dailyValue: 0 },
      calcium: { value: 0, unit: "mg", dailyValue: 0 },
      iron: { value: 0, unit: "mg", dailyValue: 0 },
      potassium: { value: 0, unit: "mg", dailyValue: 0 }
    }
  };

  const [nutritionData, setNutritionData] = useState(initialNutritionData);

  // Load the last scan result
  useEffect(() => {
    const loadLastScanResult = async () => {
      setIsLoading(true);
      try {
        const result = await getLastScanResult();
        setLastScanResult(result);

        if (result) {
          // Generate nutrition data based on the food name and ingredients
          const generatedData = generateNutritionData(result);
          setNutritionData(generatedData);
        }
      } catch (error) {
        console.error('Error loading last scan result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLastScanResult();
  }, []);

  // Generate nutrition data based on the food name and ingredients
  const generateNutritionData = (scanResult: ScanResultWithNutrition) => {
    const { foodName, ingredients } = scanResult;

    // Check if the food is likely to be healthy
    const isHealthy =
      foodName.toLowerCase().includes('salad') ||
      foodName.toLowerCase().includes('vegetable') ||
      ingredients.some(ing =>
        ing.name.toLowerCase().includes('vegetable') ||
        ing.name.toLowerCase().includes('fruit')
      );

    // Check if the food is likely to be high in protein
    const isHighProtein =
      foodName.toLowerCase().includes('meat') ||
      foodName.toLowerCase().includes('chicken') ||
      foodName.toLowerCase().includes('fish') ||
      ingredients.some(ing =>
        ing.name.toLowerCase().includes('meat') ||
        ing.name.toLowerCase().includes('chicken') ||
        ing.name.toLowerCase().includes('fish') ||
        ing.name.toLowerCase().includes('protein')
      );

    // Check if the food is likely to be high in carbs
    const isHighCarb =
      foodName.toLowerCase().includes('pasta') ||
      foodName.toLowerCase().includes('bread') ||
      foodName.toLowerCase().includes('rice') ||
      ingredients.some(ing =>
        ing.name.toLowerCase().includes('pasta') ||
        ing.name.toLowerCase().includes('bread') ||
        ing.name.toLowerCase().includes('rice') ||
        ing.name.toLowerCase().includes('carb')
      );

    // Generate calories based on food type
    const calories = isHealthy ?
      Math.floor(Math.random() * 200) + 100 :
      Math.floor(Math.random() * 400) + 300;

    // Generate protein based on food type
    const protein = isHighProtein ?
      Math.floor(Math.random() * 20) + 15 :
      Math.floor(Math.random() * 10) + 5;

    // Generate carbs based on food type
    const carbs = isHighCarb ?
      Math.floor(Math.random() * 40) + 30 :
      Math.floor(Math.random() * 20) + 10;

    // Generate fat based on food type
    const fat = isHealthy ?
      Math.floor(Math.random() * 10) + 2 :
      Math.floor(Math.random() * 15) + 10;

    // Calculate daily values
    const fatDV = Math.round((fat / 65) * 100);
    const carbsDV = Math.round((carbs / 300) * 100);
    const proteinDV = Math.round((protein / 50) * 100);

    return {
      servingSize: "1 serving",
      servingSizeGrams: 100,
      servingsPerContainer: 1,
      calories: calories,
      nutrients: {
        totalFat: { value: fat, unit: "g", dailyValue: fatDV },
        saturatedFat: { value: Math.round(fat * 0.3), unit: "g", dailyValue: Math.round((fat * 0.3 / 20) * 100) },
        transFat: { value: 0, unit: "g" },
        cholesterol: { value: isHighProtein ? 50 : 10, unit: "mg", dailyValue: isHighProtein ? 17 : 3 },
        sodium: { value: Math.floor(Math.random() * 400) + 100, unit: "mg", dailyValue: Math.floor(Math.random() * 15) + 5 },
        totalCarbohydrate: { value: carbs, unit: "g", dailyValue: carbsDV },
        dietaryFiber: { value: isHealthy ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 2) + 1, unit: "g", dailyValue: isHealthy ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 5) + 3 },
        addedSugars: { value: isHealthy ? 0 : Math.floor(Math.random() * 10) + 5, unit: "g", dailyValue: isHealthy ? 0 : Math.floor(Math.random() * 15) + 10 },
        protein: { value: protein, unit: "g" },
        vitaminD: { value: isHealthy ? 2 : 0, unit: "mcg", dailyValue: isHealthy ? 10 : 0 },
        calcium: { value: isHealthy ? 200 : 50, unit: "mg", dailyValue: isHealthy ? 15 : 4 },
        iron: { value: isHighProtein ? 3 : 1, unit: "mg", dailyValue: isHighProtein ? 15 : 6 },
        potassium: { value: isHealthy ? 300 : 100, unit: "mg", dailyValue: isHealthy ? 6 : 2 }
      }
    };
  };

  // Handle navigation to scan screen
  const handleScan = () => {
    router.push('/(tabs)/scan');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('nutritionFacts.title'),
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.background,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {t('common.loading')}
          </Text>
        </View>
      ) : lastScanResult ? (
        <ScrollView>
          <View style={styles.foodInfoContainer}>
            <Text style={[styles.foodName, { color: colors.text }]}>
              {lastScanResult.foodName}
            </Text>

            {lastScanResult.imageUri && (
              <Image
                source={{ uri: lastScanResult.imageUri }}
                style={styles.foodImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.ingredientsContainer}>
              <Text style={[styles.ingredientsTitle, { color: colors.textSecondary }]}>
                {t('nutritionFacts.ingredients')}:
              </Text>
              {lastScanResult.ingredients.map((ingredient, index) => (
                <Text key={ingredient.name} style={[styles.ingredient, { color: colors.text }]}>
                  • {ingredient.name}
                </Text>
              ))}
            </View>
          </View>

          <NutritionFacts {...nutritionData} />
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="nutrition-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.noDataText, { color: colors.text }]}>
            {t('nutritionFacts.noData')}
          </Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanButtonGradient}
          >
            <LinearGradient
              colors={[colors.card, colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanButtonWrapper}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleScan}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scanButton}
                >
                  <Text style={styles.scanButtonText}>
                    Nutrition Facts
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  scanButtonGradient: {
    width: '90%',
    borderRadius: 25,
    padding: 2,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  scanButtonWrapper: {
    width: '100%',
    borderRadius: 25,
    padding: 0,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  scanButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  foodInfoContainer: {
    padding: 16,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
});