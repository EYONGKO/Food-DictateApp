import { CLARIFAI_API_KEY, CLARIFAI_MODEL_ID } from '../config/keys';

interface ClarifaiConcept {
  id: string;
  name: string;
  value: number;
}

interface Ingredient {
  name: string;
  confidence: number;
}

interface FoodAnalysisResult {
  foodName: string;
  ingredients: Ingredient[];
}

export class FoodRecognitionService {
  private static readonly API_URL = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`;

  private static formatName(name: string): string {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private static async imageToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Safely convert result to string and extract base64 part
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public static async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    try {
      console.log('Starting food image analysis...');
      console.log('API URL:', this.API_URL);
      console.log('API Key available:', !!CLARIFAI_API_KEY);

      // Check if the image URI is valid
      if (!imageUri || typeof imageUri !== 'string') {
        throw new Error('Invalid image URI provided');
      }

      console.log('Converting image to base64...');
      const base64Data = await this.imageToBase64(imageUri);
      console.log('Base64 conversion complete. Length:', base64Data.length);

      if (!base64Data || base64Data.length === 0) {
        throw new Error('Failed to convert image to base64');
      }

      console.log('Sending request to Clarifai API...');
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [{
            data: {
              image: {
                base64: base64Data
              }
            }
          }]
        })
      });

      console.log('Response received. Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        const errorDescription = errorData.status?.description ?? `Status code ${response.status}`;
        throw new Error(`API Error: ${errorDescription}`);
      }

      const result = await response.json();
      console.log('Response parsed successfully');

      if (!result.outputs?.[0]?.data?.concepts) {
        console.error('Invalid API response format:', result);
        throw new Error('Invalid response format from API');
      }

      const concepts: ClarifaiConcept[] = result.outputs[0].data.concepts;
      console.log('Found concepts:', concepts.length);

      if (concepts.length === 0) {
        throw new Error('No food items detected in the image');
      }

      // Get the most likely food item as the main dish
      const mainDish = this.formatName(concepts[0].name);
      console.log('Main dish identified:', mainDish);

      // Get other items as ingredients, filtering out low confidence predictions
      const ingredients: Ingredient[] = concepts
        .slice(1)
        .filter(concept => concept.value > 0.5) // Only include predictions with >50% confidence
        .map(concept => ({
          name: this.formatName(concept.name),
          confidence: Math.round(concept.value * 100)
        }));

      console.log('Ingredients identified:', ingredients.length);

      return {
        foodName: mainDish,
        ingredients
      };
    } catch (error) {
      console.error('Food recognition error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to analyze food image: ${error.message}`);
      } else {
        throw new Error('Failed to analyze food image: Unknown error');
      }
    }
  }
}