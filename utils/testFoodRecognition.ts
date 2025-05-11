import { FoodRecognitionService } from '../services/foodRecognition';

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

    console.log('\nRaw API Response:', JSON.stringify(result.rawResponse, null, 2));
    console.log('\n=== Test Completed Successfully ===');
    
    return result;
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error('Error:', error);
    throw error;
  }
} 