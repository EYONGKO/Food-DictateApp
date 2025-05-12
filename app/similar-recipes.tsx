import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import SimilarRecipes from './components/SimilarRecipes';

// Food image URLs for different categories
const foodImages = {
  vegetarian: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=500&auto=format&fit=crop'
  ],
  meat: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?q=80&w=500&auto=format&fit=crop'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop'
  ],
  dessert: [
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=500&auto=format&fit=crop'
  ],
  default: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=500&auto=format&fit=crop'
  ]
};

// Generate recipes based on the food name
const generateRecipes = (foodName: string) => {
  const lowerCaseName = foodName.toLowerCase();

  // Determine food category
  let category = 'default';
  if (lowerCaseName.includes('salad') || lowerCaseName.includes('vegetable') || lowerCaseName.includes('vegan')) {
    category = 'vegetarian';
  } else if (lowerCaseName.includes('pasta') || lowerCaseName.includes('noodle') || lowerCaseName.includes('spaghetti')) {
    category = 'pasta';
  } else if (lowerCaseName.includes('cake') || lowerCaseName.includes('dessert') || lowerCaseName.includes('sweet')) {
    category = 'dessert';
  } else if (lowerCaseName.includes('meat') || lowerCaseName.includes('chicken') || lowerCaseName.includes('beef') || lowerCaseName.includes('pork')) {
    category = 'meat';
  }

  // Generate recipe names based on category
  const recipeNames = [];
  if (category === 'vegetarian') {
    recipeNames.push(
      'Roasted Vegetable Buddha Bowl',
      'Mediterranean Quinoa Salad',
      'Spicy Tofu Stir Fry',
      'Avocado & Kale Superfood Salad'
    );
  } else if (category === 'pasta') {
    recipeNames.push(
      'Creamy Mushroom Pasta',
      'Spicy Arrabbiata Penne',
      'Lemon Garlic Linguine',
      'Classic Carbonara'
    );
  } else if (category === 'dessert') {
    recipeNames.push(
      'Chocolate Lava Cake',
      'Vanilla Bean Cheesecake',
      'Fresh Berry Pavlova',
      'Caramel Apple Crumble'
    );
  } else if (category === 'meat') {
    recipeNames.push(
      'Herb-Crusted Roast Chicken',
      'Slow-Cooked Beef Brisket',
      'Garlic Butter Steak',
      'Honey Glazed Pork Tenderloin'
    );
  } else {
    recipeNames.push(
      'Homemade Pizza Margherita',
      'Spicy Thai Coconut Soup',
      'Classic French Ratatouille',
      'Crispy Falafel Wraps'
    );
  }

  // Generate tags based on category
  const tagSets = [];
  if (category === 'vegetarian') {
    tagSets.push(
      ['vegetarian', 'high-fiber'],
      ['vegetarian', 'low-carb'],
      ['vegetarian', 'high-protein'],
      ['vegetarian', 'gluten-free']
    );
  } else if (category === 'pasta') {
    tagSets.push(
      ['italian', 'comfort-food'],
      ['spicy', 'quick'],
      ['light', 'fresh'],
      ['classic', 'creamy']
    );
  } else if (category === 'dessert') {
    tagSets.push(
      ['chocolate', 'indulgent'],
      ['creamy', 'sweet'],
      ['light', 'fruity'],
      ['warm', 'comforting']
    );
  } else if (category === 'meat') {
    tagSets.push(
      ['high-protein', 'roasted'],
      ['slow-cooked', 'tender'],
      ['quick', 'high-protein'],
      ['sweet', 'savory']
    );
  } else {
    tagSets.push(
      ['italian', 'homemade'],
      ['spicy', 'asian'],
      ['french', 'vegetable-rich'],
      ['middle-eastern', 'crispy']
    );
  }

  // Generate cook times and calories
  const cookTimes = [15, 20, 25, 30];
  const calorieRanges = {
    'vegetarian': [250, 350],
    'pasta': [400, 550],
    'dessert': [300, 450],
    'meat': [350, 500],
    'default': [300, 450]
  };

  // Create recipes
  return recipeNames.map((name, index) => {
    const calorieRange = calorieRanges[category];
    const calories = Math.floor(Math.random() * (calorieRange[1] - calorieRange[0])) + calorieRange[0];

    return {
      id: (index + 1).toString(),
      name: name,
      icon: foodImages[category][index],
      cookTime: cookTimes[index],
      calories: calories,
      tags: tagSets[index]
    };
  });
};

export default function SimilarRecipesScreen() {
  const { recipeName } = useLocalSearchParams();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (recipeName) {
      // Generate recipes based on the food name
      const generatedRecipes = generateRecipes(recipeName as string);
      setRecipes(generatedRecipes);
    }
  }, [recipeName]);

  return (
    <SimilarRecipes
      baseRecipe={recipeName as string}
      recipes={recipes}
    />
  );
}