# Food Dictation 2025 - Technical Documentation

## Application Architecture

Food Dictation 2025 follows a modular architecture with clear separation of concerns. The application is built using React Native with Expo, utilizing Expo Router for navigation.

### Directory Structure

```
Food-DictateApp/
├── app/                    # Main application code (Expo Router)
│   ├── (tabs)/             # Tab-based navigation screens
│   ├── components/         # Reusable UI components
│   ├── _layout.tsx         # Root layout component
│   ├── index.tsx           # Entry point
│   ├── login.tsx           # Login screen
│   ├── register.tsx        # Registration screen
│   └── ...                 # Other screens
├── assets/                 # Static assets (images, fonts)
├── config/                 # Configuration files
├── constants/              # App constants
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization
├── services/               # API and service integrations
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Core Components

### Navigation

The app uses Expo Router for file-based navigation, with a tab-based structure for the main screens:

- `app/_layout.tsx`: Root layout that sets up the theme provider and authentication
- `app/(tabs)/_layout.tsx`: Tab navigation configuration
- `app/(tabs)/index.tsx`: Home screen
- `app/(tabs)/scan.tsx`: Scan screen
- `app/(tabs)/library.tsx`: Food library screen
- `app/(tabs)/nutrition-facts.tsx`: Nutrition facts screen
- `app/(tabs)/recipes.tsx`: Recipes screen
- `app/(tabs)/profile.tsx`: User profile screen

### State Management

The app uses React Context API for state management:

- `contexts/ThemeContext.tsx`: Manages app theme (dark/light mode)
- `contexts/AuthContext.tsx`: Handles user authentication state
- `contexts/PreferencesContext.tsx`: Manages user preferences

### Data Persistence

- `AsyncStorage`: Used for local storage of user preferences and settings
- `Firebase`: Used for authentication and cloud storage
- `MongoDB`: Used for storing user data and preferences

## Key Features Implementation

### Food Recognition

The food recognition feature uses the Clarifai API to identify food items from images:

```typescript
// services/foodRecognition.ts
export class FoodRecognitionService {
  private static API_URL = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`;
  
  public static async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    // Convert image to base64
    const base64Data = await this.imageToBase64(imageUri);
    
    // Send to Clarifai API
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
    
    // Process response
    const result = await response.json();
    const concepts = result.outputs[0].data.concepts;
    
    // Extract food name and ingredients
    return {
      foodName: concepts[0].name,
      ingredients: concepts.slice(1).map(concept => ({
        name: concept.name,
        confidence: Math.round(concept.value * 100)
      }))
    };
  }
}
```

### Nutrition Tracking

The app tracks nutrition information using a combination of the Clarifai API results and a local database of nutritional information:

```typescript
// services/nutritionTracking.ts
export class NutritionTrackingService {
  public static async getNutritionInfo(foodName: string): Promise<NutritionInfo> {
    // Fetch nutrition data from API or local database
    const nutritionData = await this.fetchNutritionData(foodName);
    
    return {
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      fiber: nutritionData.fiber,
      sugar: nutritionData.sugar,
      sodium: nutritionData.sodium,
      // Other nutrients
    };
  }
  
  public static async logFoodItem(foodItem: FoodItem, servingSize: number): Promise<void> {
    // Save to user's daily log
    const today = new Date().toISOString().split('T')[0];
    const userId = await this.getCurrentUserId();
    
    await this.saveToUserLog(userId, today, {
      ...foodItem,
      servingSize,
      timestamp: new Date().toISOString()
    });
  }
}
```

### User Preferences

The app stores and manages user preferences for personalized recommendations:

```typescript
// contexts/PreferencesContext.tsx
export const PreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietType: 'standard',
    allergies: [],
    restrictions: [],
    excludedFoods: [],
    preferredCuisines: [],
    // Other preferences
  });
  
  // Load preferences from storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedPreferences = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);
  
  // Save preferences to storage
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };
  
  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
```

## UI Components

The app uses a consistent design language with gradient borders and card-based layouts:

```typescript
// components/GradientCard.tsx
export const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  colors = [colors.primary + 'CC', '#FF6B6B', '#FFD166'],
  style 
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 15,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  content: {
    borderRadius: 13,
    padding: 16,
    overflow: 'hidden',
  },
});
```

## Authentication Flow

The app uses Firebase Authentication for user management:

```typescript
// contexts/AuthContext.tsx
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Internationalization

The app supports multiple languages using i18next:

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

## Performance Considerations

- **Image Optimization**: Images are resized before uploading to reduce bandwidth usage
- **Lazy Loading**: Components are loaded only when needed
- **Memoization**: React.memo and useMemo are used to prevent unnecessary re-renders
- **Offline Support**: Key features work offline with data synchronization when online

## Security Measures

- **Authentication**: Firebase Authentication for secure user management
- **Data Encryption**: Sensitive data is encrypted before storage
- **Input Validation**: All user inputs are validated to prevent injection attacks
- **API Key Protection**: API keys are stored securely and not exposed in client-side code

## Testing Strategy

- **Unit Tests**: Jest for testing individual components and functions
- **Integration Tests**: Testing interactions between components
- **E2E Tests**: Detox for end-to-end testing on real devices
- **Manual Testing**: User acceptance testing for UI/UX

## Deployment Process

1. **Development**: Local development and testing
2. **Staging**: Deployment to staging environment for QA
3. **Production**: Release to app stores (iOS App Store, Google Play Store)
4. **Web Deployment**: Deployment to web hosting platform

## Future Enhancements

- **Machine Learning**: Enhanced food recognition with on-device ML
- **Social Features**: Sharing recipes and progress with friends
- **Gamification**: Achievements and challenges to encourage healthy habits
- **Integration with Wearables**: Sync with fitness trackers and smartwatches
- **Voice Commands**: Voice-based food logging and app navigation

## Contact Information

For technical support or development inquiries, please contact:

- **Email**: eyongkomatchfire@gmail.com
- **Phone**: +237673953558
