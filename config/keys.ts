// Get API key from environment variable or use a secure storage method
export const CLARIFAI_API_KEY = 'be6510d7da12443bbdb2fcfcec64b115';
export const CLARIFAI_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7'; // Food recognition model

// Add error handling for missing API key
if (!CLARIFAI_API_KEY) {
    console.error('Please set your Clarifai API key in config/keys.ts');
} 