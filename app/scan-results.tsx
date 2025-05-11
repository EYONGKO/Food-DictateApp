// app/scan-results.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodRecognitionService } from '../services/foodRecognition';
import { testFoodRecognition } from '../utils/testFoodRecognition';
import { saveRecentScan } from '@/utils/storage';

// Import Theme and Translation hooks
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Define structure for ingredients and library items
interface Ingredient {
    name: string;
    confidence: number;
}
interface LibraryItem {
    id: string;
    timestamp: number;
    imageUri: string;
    foodName: string;
    ingredients: Ingredient[];
}

const LIBRARY_STORAGE_KEY = '@FoodDictateApp:Library';

// Placeholder Analysis Data (Reduced role now)
const placeholderResult = {
    foodName: "Vegetable Stir Fry",
    ingredients: [
        { name: "Bell Peppers", confidence: 95 },
        { name: "Broccoli", confidence: 93 },
        { name: "Carrots", confidence: 91 },
        { name: "Onions", confidence: 89 },
        { name: "Soy Sauce", confidence: 84 },
    ],
};

// Define expected parameter types
type ScanResultsParams = {
    imageUri?: string;
    // Params from Library
    isFromLibrary?: string; // Will be 'true' if from library
    fromRecent?: string; // Will be 'true' if from recent scans
    id?: string;
    timestamp?: string;
    foodName?: string;
    ingredients?: string; // JSON stringified array
};

// Remove the Clarifai import and add the fetch API for direct REST calls
const CLARIFAI_API_KEY = 'YOUR_CLARIFAI_API_KEY'; // Replace with your API key
const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs';

interface ClarifaiConcept {
  id: string;
  name: string;
  value: number;
}

export default function ScanResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ScanResultsParams>();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<{foodName: string; ingredients: Ingredient[]} | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(params.id || null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- Check if Item is Saved --- 
  const checkIfSaved = async (uriToCheck?: string, idToCheck?: string) => {
     if (!uriToCheck && !idToCheck) return;
     try {
       const existingLibrary = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
       const libraryItems: LibraryItem[] = existingLibrary ? JSON.parse(existingLibrary) : [];
       // Check by ID if available (more reliable), otherwise fallback to URI
       const found = idToCheck 
            ? libraryItems.some(item => item.id === idToCheck)
            : uriToCheck 
            ? libraryItems.some(item => item.imageUri === uriToCheck) 
            : false;
       setIsSaved(found);
     } catch (e) {
       console.error("Failed to check library status.", e);
     }
   };

  // Function to analyze image using Clarifai
  const analyzeImageWithClarifai = async (imageUri: string) => {
    try {
      // Convert image URI to base64
      const fetchResponse = await fetch(imageUri);
      const blob = await fetchResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');

      // Call Clarifai API
      const apiResponse = await fetch(CLARIFAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: base64Data
                }
              }
            }
          ]
        })
      });

      const result = await apiResponse.json();

      if (!result.outputs?.[0]?.data?.concepts) {
        throw new Error('Invalid response from Clarifai');
      }

      const concepts: ClarifaiConcept[] = result.outputs[0].data.concepts;
      
      // Get the most likely food item as the main dish
      const mainDish = concepts[0].name;
      
      // Get other items as ingredients, filtering out low confidence predictions
      const ingredients: Ingredient[] = concepts
        .slice(1)
        .filter(concept => concept.value > 0.5) // Only include predictions with >50% confidence
        .map(concept => ({
          name: concept.name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          confidence: Math.round(concept.value * 100)
        }));

      return {
        foodName: mainDish.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        ingredients
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  };

  // --- Effect to Load/Analyze Data --- 
  useEffect(() => {
    const analyzeImage = async () => {
      setIsLoading(true);
      setAnalysisError(null);
      setScanResult(null);
      setIsSaved(false);

      if (params.isFromLibrary === 'true' && params.imageUri && params.foodName && params.ingredients) {
        try {
          const parsedIngredients: Ingredient[] = JSON.parse(params.ingredients);
          setScanResult({
            foodName: params.foodName,
            ingredients: parsedIngredients,
          });
          setIsSaved(true);
          setCurrentItemId(params.id || null);
        } catch (e) {
          console.error("Failed to parse ingredients from library params:", e);
          setAnalysisError(t('scanResults.loadLibraryError'));
        }
      } else if (params.imageUri) {
        try {
          // Use test utility in development
          const result = __DEV__ 
            ? await testFoodRecognition(params.imageUri)
            : await FoodRecognitionService.analyzeFoodImage(params.imageUri);

          if (!result.ingredients.length) {
            throw new Error('No ingredients detected in the image');
          }

          setScanResult(result);
          checkIfSaved(params.imageUri);
          setCurrentItemId(null);

          // Save to recent scans
          if (!params.fromRecent) { // Only save if not viewing from recent scans
            await saveRecentScan({
              name: result.foodName,
              ingredients: result.ingredients.map(ing => ing.name),
              imageUri: params.imageUri,
            });
          }
        } catch (error) {
          console.error("Failed to analyze image:", error);
          setAnalysisError(
            error instanceof Error 
              ? error.message 
              : 'Failed to analyze the food image. Please try again.'
          );
        }
      } else {
        console.warn("No image URI or library data provided.");
        setAnalysisError(t('scanResults.noDataError'));
      }
      setIsLoading(false);
    };

    analyzeImage();
  }, [params.imageUri]);

  // --- Speech Handling --- 
  const speakIngredients = () => {
      // ... (speech logic remains largely the same, use t() for text)
      if (!scanResult) return;
      if (isSpeaking) {
          Speech.stop();
          setIsSpeaking(false);
          return;
      }

      const ingredientsText = scanResult.ingredients.map(ing => `${ing.name}.`).join(' ');
      const textToSpeak = `${t('scanResults.identifiedAs')} ${scanResult.foodName}. ${t('scanResults.detectedIngredients')} ${ingredientsText}`;
      setIsSpeaking(true);

      Speech.speak(textToSpeak, {
          language: i18n.language, // Now i18n is defined
          pitch: 1.0,
          rate: 1.0,
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: (error) => {
              console.error('Speech error:', error);
              setIsSpeaking(false);
              Alert.alert(t('common.error'), t('scanResults.speechError'));
          },
      });
  };

  useEffect(() => {
    // Cleanup speech on unmount
    return () => {
      Speech.stop();
    };
  }, []);

  // --- Save to Library --- 
  const handleSaveToLibrary = async () => {
    if (!scanResult || !params.imageUri) {
        Alert.alert(t('scanResults.saveErrorTitle'), t('scanResults.saveErrorNoData'));
        return;
    }
    // If it came from the library, it's already saved. Also check isSaved state.
    if (isSaved || params.isFromLibrary === 'true') {
       Alert.alert(t('scanResults.saveErrorAlreadySavedTitle'), t('scanResults.saveErrorAlreadySavedMessage'));
       return;
    }

    setIsLoading(true); // Indicate saving process

    const newItem: LibraryItem = {
        id: currentItemId || `${Date.now()}-${params.imageUri.substring(params.imageUri.length - 10)}`, // Reuse ID if available
        timestamp: params.timestamp ? parseInt(params.timestamp, 10) : Date.now(), // Reuse timestamp if available
        imageUri: params.imageUri,
        foodName: scanResult.foodName,
        ingredients: scanResult.ingredients,
    };

    try {
        const existingLibraryJSON = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
        const libraryItems: LibraryItem[] = existingLibraryJSON ? JSON.parse(existingLibraryJSON) : [];
        
        // Check again if it somehow got saved concurrently
        const alreadyExists = libraryItems.some(item => item.id === newItem.id || item.imageUri === newItem.imageUri);
        if (alreadyExists) {
             setIsSaved(true); // Update state if check failed earlier
             Alert.alert(t('scanResults.saveErrorAlreadySavedTitle'), t('scanResults.saveErrorAlreadySavedMessage'));
             setIsLoading(false);
             return;
        }

        libraryItems.unshift(newItem); // Add to beginning
        await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryItems));
        setIsSaved(true);
        setCurrentItemId(newItem.id); // Store the new ID
        console.log("[ScanResults] Item saved successfully.");
        
        Alert.alert(
          t('scanResults.saveSuccessTitle'),
          t('scanResults.saveSuccessMessage'),
          [
            {
              text: 'OK',
              onPress: () => router.push('/(tabs)/library')
            }
          ]
        );

    } catch (e) {
        console.error("Failed to save to library.", e);
        Alert.alert(t('scanResults.saveErrorTitle'), t('scanResults.saveErrorMessage'));
    } finally {
        setIsLoading(false);
    }
};

  // --- Render --- 
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text }]}>Scan Results</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Analyzing image...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (analysisError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text }]}>Scan Results</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{analysisError}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.error }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryButtonText, { color: colors.text }]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>Scan Results</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
          {params.imageUri ? (
            <Image source={{ uri: params.imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.card }]}>
              <Ionicons name="image" size={40} color={colors.textSecondary} />
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Scanned Image</Text>
            </View>
          )}
        </View>

        {scanResult && (
          <View style={styles.resultsContainer}>
            <View style={styles.identifiedSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Identified as:</Text>
              <Text style={[styles.foodName, { color: colors.text }]}>{scanResult.foodName}</Text>
            </View>

            <View style={styles.ingredientsSection}>
              <View style={styles.ingredientsHeader}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Detected Ingredients:</Text>
                <TouchableOpacity onPress={speakIngredients} style={styles.speakButton}>
                  <Ionicons 
                    name={isSpeaking ? "volume-high" : "volume-medium"} 
                    size={24} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
              </View>

              {scanResult.ingredients.map((ingredient, index) => (
                <View key={index} style={[styles.ingredientItem, { backgroundColor: `${colors.card}40` }]}>
                  <Text style={[styles.ingredientText, { color: colors.text }]}>
                    • {ingredient.name} ({ingredient.confidence}% confidence)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveToLibrary}
          disabled={isSaved}
        >
          <Text style={styles.saveButtonText}>Save to Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listenButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
          onPress={speakIngredients}
        >
          <Text style={[styles.listenButtonText, { color: colors.primary }]}>Listen to Ingredients</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles --- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  resultsContainer: {
    padding: 16,
  },
  identifiedSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  speakButton: {
    padding: 8,
  },
  ingredientItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
  },
  bottomButtons: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listenButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  listenButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});