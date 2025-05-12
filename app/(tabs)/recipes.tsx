import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Recipe {
  id: string;
  name: string;
  icon: string;
  cookTime: number;
  calories: number;
  tags: string[];
  imageUri: string;
  ingredients: string[];
}

// This would typically come from your API
const mockRecipes = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    icon: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500&auto=format&fit=crop',
    cookTime: 30,
    calories: 650,
    tags: ['Italian', 'Pasta'],
    imageUri: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Pasta', 'Eggs', 'Pecorino', 'Guanciale']
  },
  {
    id: '2',
    name: 'Caesar Salad',
    icon: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=500&auto=format&fit=crop',
    cookTime: 15,
    calories: 350,
    tags: ['Salad', 'Healthy'],
    imageUri: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Romaine', 'Croutons', 'Parmesan', 'Caesar Dressing']
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    icon: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500&auto=format&fit=crop',
    cookTime: 45,
    calories: 800,
    tags: ['Italian', 'Pizza'],
    imageUri: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Dough', 'Tomatoes', 'Mozzarella', 'Basil']
  },
  {
    id: '4',
    name: 'Chicken Stir Fry',
    icon: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=500&auto=format&fit=crop',
    cookTime: 25,
    calories: 420,
    tags: ['Asian', 'High-protein'],
    imageUri: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Chicken', 'Bell Peppers', 'Broccoli', 'Soy Sauce']
  },
  {
    id: '5',
    name: 'Vegetable Curry',
    icon: 'https://images.unsplash.com/photo-1631292784640-2b24be784d1c?q=80&w=500&auto=format&fit=crop',
    cookTime: 35,
    calories: 380,
    tags: ['Indian', 'Vegetarian'],
    imageUri: 'https://images.unsplash.com/photo-1631292784640-2b24be784d1c?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Vegetables', 'Coconut Milk', 'Curry Paste', 'Rice']
  },
  {
    id: '6',
    name: 'Avocado Toast',
    icon: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=500&auto=format&fit=crop',
    cookTime: 10,
    calories: 320,
    tags: ['Breakfast', 'Vegetarian'],
    imageUri: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=500&auto=format&fit=crop',
    ingredients: ['Bread', 'Avocado', 'Eggs', 'Red Pepper Flakes']
  }
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function RecipesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { category: initialCategory } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory as string || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState(mockRecipes);

  const categories = ['All', 'Vegetarian', 'Low-carb', 'High-protein'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' ||
      recipe.tags.includes(selectedCategory.toLowerCase());
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCardWrapper}
      onPress={() => {
        router.push({
          pathname: '/scan-results',
          params: {
            imageUri: recipe.imageUri,
            foodName: recipe.name,
            ingredients: JSON.stringify(recipe.ingredients),
            isFromLibrary: 'true'
          }
        });
      }}
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
              style={styles.recipeImage}
              resizeMode="cover"
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
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <LinearGradient
          colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.searchBarGradient}
        >
          <LinearGradient
            colors={[theme.colors.card, theme.colors.card + '99']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.searchBar, { borderColor: 'transparent' }]}
          >
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search recipes..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </LinearGradient>
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
        {filteredRecipes.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
              No recipes found
            </Text>
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </View>
        )}
      </ScrollView>
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
  searchContainer: {
    padding: 16,
    paddingTop: 60,
  },
  searchBarGradient: {
    width: '100%',
    borderRadius: 15,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
    gap: 12,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
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
    borderRadius: 15,
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
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeIcon: {
    fontSize: 48,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeContent: {
    padding: 12,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    height: 40,
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
    fontSize: 13,
    fontWeight: '500',
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
  },
});