import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SCANS_KEY = '@food_dictate:recent_scans';
const LAST_SCAN_RESULT_KEY = '@food_dictate:last_scan_result';

export interface RecentScan {
  id: string;
  name: string;
  ingredients: string[];
  date: string;
  imageUri?: string;
}

export const saveRecentScan = async (scan: Omit<RecentScan, 'id' | 'date'>) => {
  try {
    // Get existing scans
    const existingScans = await getRecentScans();

    // Create new scan object with id and date
    const newScan: RecentScan = {
      ...scan,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    // Add new scan to the beginning of the array and limit to 10 items
    const updatedScans = [newScan, ...existingScans].slice(0, 10);

    // Save to storage
    await AsyncStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(updatedScans));

    return newScan;
  } catch (error) {
    console.error('Error saving recent scan:', error);
    throw error;
  }
};

export const getRecentScans = async (): Promise<RecentScan[]> => {
  try {
    const scans = await AsyncStorage.getItem(RECENT_SCANS_KEY);
    return scans ? JSON.parse(scans) : [];
  } catch (error) {
    console.error('Error getting recent scans:', error);
    return [];
  }
};

export const clearRecentScans = async () => {
  try {
    await AsyncStorage.removeItem(RECENT_SCANS_KEY);
  } catch (error) {
    console.error('Error clearing recent scans:', error);
    throw error;
  }
};

// Interface for scan result with nutrition data
export interface ScanResultWithNutrition {
  foodName: string;
  ingredients: { name: string; confidence: number }[];
  imageUri?: string;
  timestamp: number;
}

// Save the last scan result with nutrition data
export const saveLastScanResult = async (scanResult: ScanResultWithNutrition) => {
  try {
    await AsyncStorage.setItem(LAST_SCAN_RESULT_KEY, JSON.stringify(scanResult));
    return true;
  } catch (error) {
    console.error('Error saving last scan result:', error);
    return false;
  }
};

// Get the last scan result with nutrition data
export const getLastScanResult = async (): Promise<ScanResultWithNutrition | null> => {
  try {
    const result = await AsyncStorage.getItem(LAST_SCAN_RESULT_KEY);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Error getting last scan result:', error);
    return null;
  }
};