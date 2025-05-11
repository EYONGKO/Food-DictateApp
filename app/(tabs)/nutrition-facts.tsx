import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import NutritionFacts from '../components/NutritionFacts';

export default function NutritionFactsScreen() {
  const theme = useTheme();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial nutrition data with all values set to zero
  const initialNutritionData = {
    servingSize: "1 cup",
    servingSizeGrams: 0,
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: "Nutrition Facts",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.background,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {isAnalyzing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <NutritionFacts {...nutritionData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 