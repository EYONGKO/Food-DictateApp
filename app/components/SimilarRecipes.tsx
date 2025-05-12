import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Recipe {
  id: string;
  name: string;
  icon: string;
  cookTime: number;
  calories: number;
  tags: string[];
}

interface SimilarRecipesProps {
  baseRecipe: string;
  recipes: Recipe[];
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap (16)

export default function SimilarRecipes({ baseRecipe, recipes }: SimilarRecipesProps) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vegetarian', 'Low-carb', 'High-protein'];

  const filteredRecipes = selectedCategory === 'All'
    ? recipes
    : recipes.filter(recipe => recipe.tags.includes(selectedCategory.toLowerCase()));

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push({
          pathname: '/scan-results',
          params: {
            imageUri: recipe.icon,
            foodName: recipe.name,
            ingredients: JSON.stringify(recipe.tags),
            isFromLibrary: 'true'
          }
        })}
      >
        <Animated.View
          style={[
            styles.recipeCardWrapper,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.recipeCardGradient}
          >
            <LinearGradient
              colors={[theme.colors.card, theme.colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.recipeCard, { borderColor: 'transparent' }]}
            >
              <View style={[styles.recipeImageContainer, { backgroundColor: theme.colors.background }]}>
                <Image
                  source={{ uri: recipe.icon }}
                  style={styles.recipeIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.recipeContent}>
                <Text style={[styles.recipeName, { color: theme.colors.text }]} numberOfLines={2}>
                  {recipe.name}
                </Text>
                <View style={styles.recipeInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                      {recipe.cookTime} min
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="flame-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                      {recipe.calories} cal
                    </Text>
                  </View>
                </View>
                <View style={styles.tagContainer}>
                  {recipe.tags.slice(0, 2).map((tag, index) => (
                    <View
                      key={`tag-${index}`}
                      style={[styles.tag, { backgroundColor: theme.colors.primary + '20' }]}
                    >
                      <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.background}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.background }]}>
          Similar Recipes
        </Text>
      </View>

      <View style={styles.baseRecipe}>
        <Ionicons name="leaf" size={24} color={theme.colors.primary} />
        <Text style={[styles.baseRecipeText, { color: theme.colors.text }]}>
          Based on "{baseRecipe}"
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <View
            key={category}
            style={styles.categoryButtonWrapper}
          >
            {selectedCategory === category ? (
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.categoryButton, styles.activeCategory]}
              >
                <TouchableOpacity
                  style={styles.categoryButtonTouchable}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.categoryText, { color: theme.colors.background }]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.categoryButton, { backgroundColor: theme.colors.card }]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                  {category}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.recipesContainer}
      >
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>

        <View style={styles.seeAllButtonContainer}>
          <LinearGradient
            colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.seeAllButtonGradient}
          >
            <LinearGradient
              colors={[theme.colors.card, theme.colors.card + '99']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.seeAllButtonWrapper}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => router.push({
                  pathname: '/(tabs)/recipes',
                  params: { category: selectedCategory }
                })}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.seeAllButton}
                >
                  <Ionicons name="restaurant" size={20} color="white" style={styles.seeAllIcon} />
                  <Text style={[styles.seeAllText, { color: 'white' }]}>
                    Explore All Recipes
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>

          <Text style={[styles.seeAllSubtext, { color: theme.colors.textSecondary }]}>
            Discover more delicious recipes in our collection
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  baseRecipe: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  baseRecipeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoriesContainer: {
    maxHeight: 48,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryButtonWrapper: {
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButtonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCategory: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recipesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  recipeCardWrapper: {
    width: cardWidth,
    marginBottom: 16,
  },
  recipeCardGradient: {
    width: '100%',
    borderRadius: 16,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  recipeCard: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  recipeImageContainer: {
    height: cardWidth * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  recipeIcon: {
    width: '100%',
    height: '100%',
  },
  recipeContent: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  seeAllButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  seeAllButtonGradient: {
    width: '100%',
    borderRadius: 25,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  seeAllButtonWrapper: {
    width: '100%',
    borderRadius: 25,
    padding: 0,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 25,
    width: '100%',
    gap: 8,
  },
  seeAllIcon: {
    marginRight: 4,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  seeAllSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});