import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SimilarRecipes from './components/SimilarRecipes';

export default function SimilarRecipesScreen() {
  const { recipeName } = useLocalSearchParams();

  // Example data - this would typically come from your API or state management
  const exampleRecipes = [
    {
      id: '1',
      name: 'Broccoli & Tofu Stir Fry',
      icon: '🥦',
      cookTime: 20,
      calories: 240,
      tags: ['vegetarian', 'low-carb']
    },
    {
      id: '2',
      name: 'Spicy Veggie Noodles',
      icon: '🌶️',
      cookTime: 15,
      calories: 310,
      tags: ['vegetarian', 'spicy']
    },
    {
      id: '3',
      name: 'Vegetable Fried Rice',
      icon: '🍚',
      cookTime: 25,
      calories: 380,
      tags: ['vegetarian']
    },
    {
      id: '4',
      name: 'Buddha Bowl',
      icon: '🥗',
      cookTime: 30,
      calories: 420,
      tags: ['vegetarian', 'high-protein']
    }
  ];

  return (
    <SimilarRecipes
      baseRecipe={recipeName as string}
      recipes={exampleRecipes}
    />
  );
} 