import { FoodRecognitionService } from '../services/foodRecognition';

// Mock data for testing in case the API fails
const mockFoodData = {
  foodName: "Vegetable Stir Fry",
  ingredients: [
    { name: "Bell Peppers", confidence: 95 },
    { name: "Broccoli", confidence: 93 },
    { name: "Carrots", confidence: 91 },
    { name: "Onions", confidence: 89 },
    { name: "Soy Sauce", confidence: 84 },
  ],
  rawResponse: { /* Mock API response */ }
};

export async function testFoodRecognition(imageUri: string) {
  console.log('=== Starting Food Recognition Test ===');
  console.log('Testing image:', imageUri);

  try {
    const startTime = Date.now();
    const result = await FoodRecognitionService.analyzeFoodImage(imageUri);
    const duration = Date.now() - startTime;

    console.log('\nTest Results:');
    console.log('Duration:', duration, 'ms');
    console.log('Main Dish:', result.foodName);
    console.log('\nIngredients:');
    result.ingredients.forEach((ing, index) => {
      console.log(`${index + 1}. ${ing.name} (${ing.confidence}% confidence)`);
    });

    console.log('\n=== Test Completed Successfully ===');

    return result;
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error('Error:', error);

    // In development, return mock data instead of failing
    if (__DEV__) {
      console.log('Using mock data for development');
      return mockFoodData;
    }

    throw error;
  }
}