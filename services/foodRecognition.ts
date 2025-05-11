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
        const base64 = String(reader.result).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public static async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    try {
      const base64Data = await this.imageToBase64(imageUri);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.status?.description || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.outputs?.[0]?.data?.concepts) {
        throw new Error('Invalid response format from API');
      }

      const concepts: ClarifaiConcept[] = result.outputs[0].data.concepts;
      
      // Get the most likely food item as the main dish
      const mainDish = this.formatName(concepts[0].name);
      
      // Get other items as ingredients, filtering out low confidence predictions
      const ingredients: Ingredient[] = concepts
        .slice(1)
        .filter(concept => concept.value > 0.5) // Only include predictions with >50% confidence
        .map(concept => ({
          name: this.formatName(concept.name),
          confidence: Math.round(concept.value * 100)
        }));

      return {
        foodName: mainDish,
        ingredients
      };
    } catch (error) {
      console.error('Food recognition error:', error);
      throw new Error('Failed to analyze food image');
    }
  }
} 