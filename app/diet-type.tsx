import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Storage key
const DIET_TYPE_KEY = '@FoodDictateApp:DietType';

// Diet types
const DIET_TYPES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'No specific dietary pattern',
    icon: 'restaurant-outline',
    details: 'A balanced diet with no specific restrictions. Includes all food groups in moderation.'
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat, may include dairy and eggs',
    icon: 'leaf-outline',
    details: 'Excludes meat, poultry, and seafood. May include dairy products, eggs, and honey.'
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products',
    icon: 'flower-outline',
    details: 'Excludes all animal products including meat, dairy, eggs, and honey. Plant-based foods only.'
  },
  {
    id: 'pescatarian',
    name: 'Pescatarian',
    description: 'Vegetarian plus seafood',
    icon: 'fish-outline',
    details: 'Includes plant foods and seafood, but excludes other animal meats like beef, pork, and poultry.'
  },
  {
    id: 'keto',
    name: 'Ketogenic',
    description: 'Very low carb, high fat',
    icon: 'flame-outline',
    details: 'Very low in carbohydrates, moderate in protein, and high in fat. Typically limits carbs to 20-50g per day.'
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Based on foods available to early humans',
    icon: 'nutrition-outline',
    details: 'Focuses on whole foods like lean meats, fish, fruits, vegetables, nuts, and seeds. Excludes processed foods, grains, legumes, and dairy.'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Based on traditional Mediterranean cuisine',
    icon: 'sunny-outline',
    details: 'Rich in plant foods, olive oil, fish, and moderate amounts of dairy, eggs, and wine. Limited red meat consumption.'
  },
  {
    id: 'lowCarb',
    name: 'Low Carb',
    description: 'Reduced carbohydrate intake',
    icon: 'barbell-outline',
    details: 'Limits carbohydrate intake, especially refined carbs and sugars. Typically 50-150g of carbs per day.'
  },
  {
    id: 'dash',
    name: 'DASH',
    description: 'Dietary Approach to Stop Hypertension',
    icon: 'heart-outline',
    details: 'Designed to help treat or prevent high blood pressure. Emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limits sodium, red meat, and sweets.'
  },
  {
    id: 'glutenFree',
    name: 'Gluten Free',
    description: 'No gluten-containing foods',
    icon: 'close-circle-outline',
    details: 'Excludes gluten, a protein found in wheat, barley, rye, and triticale. Essential for those with celiac disease or gluten sensitivity.'
  },
  {
    id: 'whole30',
    name: 'Whole30',
    description: '30-day elimination diet',
    icon: 'calendar-outline',
    details: 'A 30-day elimination diet that excludes sugar, alcohol, grains, legumes, dairy, and additives. Focuses on whole, unprocessed foods.'
  },
  {
    id: 'intermittentFasting',
    name: 'Intermittent Fasting',
    description: 'Cycling between eating and fasting periods',
    icon: 'time-outline',
    details: 'Alternates between periods of eating and fasting. Common patterns include 16:8 (16 hours fasting, 8 hours eating) or 5:2 (5 days normal eating, 2 days restricted calories).'
  }
];

export default function DietTypeScreen() {
  const { colors } = useTheme();
  const [selectedDiet, setSelectedDiet] = useState('standard');
  const [selectedDietDetails, setSelectedDietDetails] = useState(DIET_TYPES[0]);
  
  // Load saved diet type
  useEffect(() => {
    const loadDietType = async () => {
      try {
        const savedDietType = await AsyncStorage.getItem(DIET_TYPE_KEY);
        if (savedDietType) {
          setSelectedDiet(savedDietType);
          setSelectedDietDetails(DIET_TYPES.find(diet => diet.id === savedDietType) || DIET_TYPES[0]);
        }
      } catch (error) {
        console.error('Failed to load diet type:', error);
      }
    };
    loadDietType();
  }, []);
  
  // Save diet type
  const saveDietType = async (dietId: string) => {
    try {
      await AsyncStorage.setItem(DIET_TYPE_KEY, dietId);
      setSelectedDiet(dietId);
      const dietDetails = DIET_TYPES.find(diet => diet.id === dietId) || DIET_TYPES[0];
      setSelectedDietDetails(dietDetails);
      Alert.alert('Success', `Your diet type has been set to ${dietDetails.name}.`);
    } catch (error) {
      console.error('Failed to save diet type:', error);
      Alert.alert('Error', 'Failed to save your diet type. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Diet Type</Text>
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
              <Ionicons name="leaf" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Select your diet type for personalized recommendations
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Selected Diet Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Current Diet</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.selectedDietContainer}>
                <View style={[styles.selectedDietIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={selectedDietDetails.icon as any} size={40} color={colors.primary} />
                </View>
                <Text style={[styles.selectedDietName, { color: colors.text }]}>
                  {selectedDietDetails.name}
                </Text>
                <Text style={[styles.selectedDietDescription, { color: colors.textSecondary }]}>
                  {selectedDietDetails.description}
                </Text>
                <Text style={[styles.selectedDietDetails, { color: colors.text }]}>
                  {selectedDietDetails.details}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Diet Types Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Choose Your Diet</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.dietTypesContainer}>
                {DIET_TYPES.map(diet => (
                  <TouchableOpacity
                    key={diet.id}
                    style={[
                      styles.dietTypeButton,
                      selectedDiet === diet.id && styles.selectedDietType,
                      { 
                        borderColor: colors.border,
                        backgroundColor: selectedDiet === diet.id ? colors.primary + '15' : 'transparent'
                      }
                    ]}
                    onPress={() => saveDietType(diet.id)}
                  >
                    <View style={styles.dietTypeHeader}>
                      <Ionicons 
                        name={diet.icon as any} 
                        size={24} 
                        color={selectedDiet === diet.id ? colors.primary : colors.textSecondary} 
                      />
                      <View style={styles.dietTypeTextContainer}>
                        <Text 
                          style={[
                            styles.dietTypeName, 
                            { color: selectedDiet === diet.id ? colors.primary : colors.text }
                          ]}
                        >
                          {diet.name}
                        </Text>
                        <Text style={[styles.dietTypeDescription, { color: colors.textSecondary }]}>
                          {diet.description}
                        </Text>
                      </View>
                      {selectedDiet === diet.id && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Your diet type will be used to filter and customize your food recommendations.
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
  selectedDietContainer: {
    alignItems: 'center',
    padding: 16,
  },
  selectedDietIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDietName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedDietDescription: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedDietDetails: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  dietTypesContainer: {
    paddingVertical: 8,
  },
  dietTypeButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedDietType: {
    borderWidth: 2,
  },
  dietTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietTypeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  dietTypeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dietTypeDescription: {
    fontSize: 14,
    marginTop: 2,
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
