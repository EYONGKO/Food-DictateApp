// app/(tabs)/library.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// ... LibraryItem interface ...
interface LibraryItem {
    id: string;
    timestamp: number;
    imageUri: string;
    foodName: string;
    ingredients: Array<{ name: string; confidence: number }>;
}

const LIBRARY_STORAGE_KEY = '@FoodDictateApp:Library';

// Define colors (or get entirely from theme)
const COLORS = {
  red: '#F44336', // Keep for remove button
};

export default function LibraryScreen() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // --- Load Library --- 
  const loadLibrary = async () => {
    setIsLoading(true);
    try {
      const storedItemsJSON = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
      if (storedItemsJSON) {
        setLibraryItems(JSON.parse(storedItemsJSON));
      } else {
        setLibraryItems([]);
      }
    } catch (e) {
      console.error("Failed to load library items.", e);
      Alert.alert(t('common.error'), t('library.loadError'));
      setLibraryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load on focus
  useFocusEffect(
    React.useCallback(() => {
      loadLibrary();
    }, [])
  );

  // --- Remove Item --- 
  const removeItem = async (idToRemove: string) => {
     Alert.alert(
       t('library.confirmRemoveTitle'),
       t('library.confirmRemoveMessage'),
       [
         { text: t('common.cancel'), style: "cancel" },
         {
           text: t('library.removeButton'),
           style: "destructive",
           onPress: async () => {
             try {
               const updatedItems = libraryItems.filter(item => item.id !== idToRemove);
               setLibraryItems(updatedItems);
               await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updatedItems));
             } catch (e) {
               console.error("Failed to remove item.", e);
               Alert.alert(t('common.error'), t('library.removeError'));
               loadLibrary();
             }
           },
         },
       ]
     );
   };

  // --- View Item Details --- 
   const viewItemDetails = (item: LibraryItem) => {
        // Navigate to scan-results, passing all necessary data
        router.push({
            pathname: '/scan-results',
            params: {
                imageUri: item.imageUri,
                foodName: item.foodName,
                ingredients: JSON.stringify(item.ingredients),
                timestamp: item.timestamp,
                id: item.id,
                isFromLibrary: 'true'
            }
        });
   };

  // --- Render Item --- 
  const renderItem = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity 
      style={[
        styles.itemContainer,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={() => viewItemDetails(item)}
    >
      <Image source={{ uri: item.imageUri }} style={[styles.itemImage, { backgroundColor: colors.border }]} />
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemFoodName, { color: colors.text }]}>{item.foodName}</Text>
        <Text style={[styles.itemTimestamp, { color: colors.textSecondary }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color={COLORS.red} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // --- Render --- 
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { color: colors.background }]}>{t('library.title')}</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('library.loading')}</Text>
        </View>
      ) : libraryItems.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="archive-outline" size={60} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>{t('library.emptyTitle')}</Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>{t('library.emptySubtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={libraryItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

// --- Styles --- 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemFoodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  itemTimestamp: {
    fontSize: 12,
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
});