import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Storage key
const FOOD_EXCLUSIONS_KEY = '@FoodDictateApp:FoodExclusions';

// Common food categories for exclusion
const FOOD_CATEGORIES = [
  {
    name: 'Vegetables',
    items: ['Broccoli', 'Cauliflower', 'Brussels Sprouts', 'Eggplant', 'Okra', 'Beets', 'Radishes', 'Turnips', 'Mushrooms', 'Bell Peppers', 'Onions', 'Garlic', 'Tomatoes', 'Spinach', 'Kale']
  },
  {
    name: 'Fruits',
    items: ['Bananas', 'Apples', 'Oranges', 'Grapes', 'Strawberries', 'Blueberries', 'Pineapple', 'Mango', 'Papaya', 'Kiwi', 'Watermelon', 'Cantaloupe', 'Grapefruit', 'Lemons', 'Limes']
  },
  {
    name: 'Proteins',
    items: ['Beef', 'Pork', 'Chicken', 'Turkey', 'Lamb', 'Fish', 'Shrimp', 'Crab', 'Lobster', 'Tofu', 'Tempeh', 'Seitan', 'Eggs', 'Beans', 'Lentils']
  },
  {
    name: 'Dairy',
    items: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Ice Cream', 'Cottage Cheese', 'Sour Cream', 'Cream Cheese', 'Whey', 'Casein']
  },
  {
    name: 'Grains',
    items: ['Wheat', 'Rice', 'Oats', 'Barley', 'Corn', 'Quinoa', 'Rye', 'Millet', 'Buckwheat', 'Bulgur', 'Couscous', 'Pasta', 'Bread', 'Cereal']
  },
  {
    name: 'Nuts & Seeds',
    items: ['Almonds', 'Walnuts', 'Cashews', 'Pistachios', 'Pecans', 'Hazelnuts', 'Peanuts', 'Sunflower Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Flax Seeds', 'Sesame Seeds']
  },
  {
    name: 'Spices & Herbs',
    items: ['Cilantro', 'Parsley', 'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Sage', 'Mint', 'Cumin', 'Coriander', 'Turmeric', 'Cinnamon', 'Nutmeg', 'Cloves', 'Ginger']
  },
  {
    name: 'Sweeteners',
    items: ['Sugar', 'Honey', 'Maple Syrup', 'Agave Nectar', 'Stevia', 'Aspartame', 'Sucralose', 'Saccharin', 'Erythritol', 'Xylitol']
  }
];

export default function FoodExclusionsScreen() {
  const { colors } = useTheme();
  const [excludedFoods, setExcludedFoods] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  
  // Load saved exclusions
  useEffect(() => {
    const loadExclusions = async () => {
      try {
        const savedExclusions = await AsyncStorage.getItem(FOOD_EXCLUSIONS_KEY);
        if (savedExclusions) {
          setExcludedFoods(JSON.parse(savedExclusions));
        }
      } catch (error) {
        console.error('Failed to load food exclusions:', error);
      }
    };
    loadExclusions();
  }, []);
  
  // Save exclusions
  const saveExclusions = async (exclusions: string[]) => {
    try {
      await AsyncStorage.setItem(FOOD_EXCLUSIONS_KEY, JSON.stringify(exclusions));
      setExcludedFoods(exclusions);
    } catch (error) {
      console.error('Failed to save food exclusions:', error);
      Alert.alert('Error', 'Failed to save your food exclusions. Please try again.');
    }
  };
  
  // Add food exclusion
  const addExclusion = () => {
    if (newExclusion.trim() === '') return;
    
    const updatedExclusions = [...excludedFoods, newExclusion.trim()];
    saveExclusions(updatedExclusions);
    setNewExclusion('');
  };
  
  // Remove food exclusion
  const removeExclusion = (food: string) => {
    const updatedExclusions = excludedFoods.filter(item => item !== food);
    saveExclusions(updatedExclusions);
  };
  
  // Toggle food exclusion
  const toggleExclusion = (food: string) => {
    if (excludedFoods.includes(food)) {
      removeExclusion(food);
    } else {
      const updatedExclusions = [...excludedFoods, food];
      saveExclusions(updatedExclusions);
    }
  };
  
  // Select category
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    
    const categoryItems = FOOD_CATEGORIES.find(cat => cat.name === category)?.items || [];
    setFilteredItems(categoryItems);
  };
  
  // Search foods
  const searchFoods = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      if (selectedCategory) {
        const categoryItems = FOOD_CATEGORIES.find(cat => cat.name === selectedCategory)?.items || [];
        setFilteredItems(categoryItems);
      } else {
        setFilteredItems([]);
      }
      return;
    }
    
    let results: string[] = [];
    
    if (selectedCategory) {
      // Search within selected category
      const categoryItems = FOOD_CATEGORIES.find(cat => cat.name === selectedCategory)?.items || [];
      results = categoryItems.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Search across all categories
      FOOD_CATEGORIES.forEach(category => {
        const matchingItems = category.items.filter(item => 
          item.toLowerCase().includes(query.toLowerCase())
        );
        results = [...results, ...matchingItems];
      });
    }
    
    setFilteredItems(results);
  };
  
  // Clear all exclusions
  const clearAllExclusions = () => {
    Alert.alert(
      'Clear All Exclusions',
      'Are you sure you want to clear all food exclusions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => saveExclusions([])
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Food Exclusions</Text>
        <TouchableOpacity onPress={clearAllExclusions} style={styles.clearButton}>
          <Text style={[styles.clearButtonText, { color: colors.error }]}>Clear All</Text>
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
              <Ionicons name="close-circle" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Add foods you want to avoid in your recommendations
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Current Exclusions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Your Excluded Foods</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {excludedFoods.length > 0 ? (
                <View style={styles.exclusionsList}>
                  {excludedFoods.map((food, index) => (
                    <View key={index} style={[styles.exclusionItem, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.exclusionText, { color: colors.text }]}>{food}</Text>
                      <TouchableOpacity onPress={() => removeExclusion(food)}>
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  You haven't excluded any foods yet.
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>
        
        {/* Add Exclusion Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Add Custom Exclusion</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.addExclusionContainer}>
                <TextInput
                  style={[styles.exclusionInput, { color: colors.text, borderColor: colors.border }]}
                  value={newExclusion}
                  onChangeText={setNewExclusion}
                  placeholder="Enter a food to exclude"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={addExclusion}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Browse Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Browse Categories</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScrollView}
                contentContainerStyle={styles.categoriesContainer}
              >
                {FOOD_CATEGORIES.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && styles.selectedCategory,
                      { 
                        borderColor: colors.border,
                        backgroundColor: selectedCategory === category.name ? colors.primary : 'transparent'
                      }
                    ]}
                    onPress={() => selectCategory(category.name)}
                  >
                    <Text 
                      style={[
                        styles.categoryText, 
                        { 
                          color: selectedCategory === category.name ? '#fff' : colors.text 
                        }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
                  value={searchQuery}
                  onChangeText={searchFoods}
                  placeholder={selectedCategory ? `Search in ${selectedCategory}...` : "Search all foods..."}
                  placeholderTextColor={colors.textSecondary}
                />
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              </View>
              
              {filteredItems.length > 0 ? (
                <View style={styles.foodItemsContainer}>
                  {filteredItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.foodItem,
                        excludedFoods.includes(item) && styles.excludedFoodItem,
                        { 
                          borderColor: colors.border,
                          backgroundColor: excludedFoods.includes(item) ? colors.error + '15' : 'transparent'
                        }
                      ]}
                      onPress={() => toggleExclusion(item)}
                    >
                      <Text 
                        style={[
                          styles.foodItemText, 
                          { 
                            color: excludedFoods.includes(item) ? colors.error : colors.text 
                          }
                        ]}
                      >
                        {item}
                      </Text>
                      {excludedFoods.includes(item) ? (
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      ) : (
                        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                selectedCategory || searchQuery ? (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No foods found. Try a different search or category.
                  </Text>
                ) : (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Select a category or search for foods to exclude.
                  </Text>
                )
              )}
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Excluded foods will not appear in your meal recommendations.
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
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
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
  exclusionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  exclusionText: {
    fontSize: 14,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  addExclusionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exclusionInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScrollView: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  selectedCategory: {
    borderWidth: 0,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 36,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
  },
  foodItemsContainer: {
    marginTop: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  excludedFoodItem: {
    borderWidth: 1,
  },
  foodItemText: {
    fontSize: 16,
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
