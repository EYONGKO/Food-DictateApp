import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
    icon: '🍝',
    cookTime: 30,
    calories: 650,
    tags: ['Italian', 'Pasta'],
    imageUri: 'https://example.com/carbonara.jpg',
    ingredients: ['Pasta', 'Eggs', 'Pecorino', 'Guanciale']
  },
  {
    id: '2',
    name: 'Caesar Salad',
    icon: '🥗',
    cookTime: 15,
    calories: 350,
    tags: ['Salad', 'Healthy'],
    imageUri: 'https://example.com/caesar.jpg',
    ingredients: ['Romaine', 'Croutons', 'Parmesan', 'Caesar Dressing']
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    icon: '🍕',
    cookTime: 45,
    calories: 800,
    tags: ['Italian', 'Pizza'],
    imageUri: 'https://example.com/pizza.jpg',
    ingredients: ['Dough', 'Tomatoes', 'Mozzarella', 'Basil']
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
      style={[styles.recipeCard, { 
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.text,
      }]}
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
      <View style={[styles.recipeImageContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.recipeIcon}>{recipe.icon}</Text>
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
              key={index} 
              style={[styles.tag, { backgroundColor: theme.colors.primary + '20' }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
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
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategory,
              { 
                backgroundColor: selectedCategory === category 
                  ? theme.colors.primary 
                  : theme.colors.card 
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              { 
                color: selectedCategory === category 
                  ? theme.colors.background 
                  : theme.colors.text 
              }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
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
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  recipeCard: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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