import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Storage key
const DIETARY_RESTRICTIONS_KEY = '@FoodDictateApp:DietaryRestrictions';

// Common allergens
const COMMON_ALLERGENS = [
  { id: 'dairy', name: 'Dairy', icon: 'cafe-outline' },
  { id: 'eggs', name: 'Eggs', icon: 'egg-outline' },
  { id: 'peanuts', name: 'Peanuts', icon: 'nutrition-outline' },
  { id: 'treeNuts', name: 'Tree Nuts', icon: 'leaf-outline' },
  { id: 'fish', name: 'Fish', icon: 'fish-outline' },
  { id: 'shellfish', name: 'Shellfish', icon: 'restaurant-outline' },
  { id: 'wheat', name: 'Wheat', icon: 'flower-outline' },
  { id: 'soy', name: 'Soy', icon: 'water-outline' },
  { id: 'sesame', name: 'Sesame', icon: 'seed-outline' },
];

// Common intolerances
const COMMON_INTOLERANCES = [
  { id: 'gluten', name: 'Gluten', icon: 'nutrition-outline' },
  { id: 'lactose', name: 'Lactose', icon: 'cafe-outline' },
  { id: 'fructose', name: 'Fructose', icon: 'nutrition-outline' },
  { id: 'histamine', name: 'Histamine', icon: 'flask-outline' },
  { id: 'fodmap', name: 'FODMAP', icon: 'nutrition-outline' },
];

interface DietaryRestrictions {
  allergies: string[];
  intolerances: string[];
  customRestrictions: string[];
  avoidanceLevel: 'strict' | 'moderate' | 'mild';
}

// Default dietary restrictions
const DEFAULT_RESTRICTIONS: DietaryRestrictions = {
  allergies: [],
  intolerances: [],
  customRestrictions: [],
  avoidanceLevel: 'strict',
};

export default function DietaryRestrictionsScreen() {
  const { colors } = useTheme();
  const [restrictions, setRestrictions] = useState<DietaryRestrictions>(DEFAULT_RESTRICTIONS);
  const [newRestriction, setNewRestriction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Load saved restrictions
  useEffect(() => {
    const loadRestrictions = async () => {
      try {
        const savedRestrictions = await AsyncStorage.getItem(DIETARY_RESTRICTIONS_KEY);
        if (savedRestrictions) {
          setRestrictions(JSON.parse(savedRestrictions));
        }
      } catch (error) {
        console.error('Failed to load dietary restrictions:', error);
      }
    };
    loadRestrictions();
  }, []);
  
  // Save restrictions
  const saveRestrictions = async () => {
    try {
      await AsyncStorage.setItem(DIETARY_RESTRICTIONS_KEY, JSON.stringify(restrictions));
      Alert.alert('Success', 'Your dietary restrictions have been saved.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save dietary restrictions:', error);
      Alert.alert('Error', 'Failed to save your dietary restrictions. Please try again.');
    }
  };
  
  // Toggle allergen
  const toggleAllergen = (id: string) => {
    setRestrictions(prev => {
      if (prev.allergies.includes(id)) {
        return {
          ...prev,
          allergies: prev.allergies.filter(a => a !== id)
        };
      } else {
        return {
          ...prev,
          allergies: [...prev.allergies, id]
        };
      }
    });
  };
  
  // Toggle intolerance
  const toggleIntolerance = (id: string) => {
    setRestrictions(prev => {
      if (prev.intolerances.includes(id)) {
        return {
          ...prev,
          intolerances: prev.intolerances.filter(i => i !== id)
        };
      } else {
        return {
          ...prev,
          intolerances: [...prev.intolerances, id]
        };
      }
    });
  };
  
  // Add custom restriction
  const addCustomRestriction = () => {
    if (newRestriction.trim() === '') return;
    
    setRestrictions(prev => ({
      ...prev,
      customRestrictions: [...prev.customRestrictions, newRestriction.trim()]
    }));
    setNewRestriction('');
  };
  
  // Remove custom restriction
  const removeCustomRestriction = (index: number) => {
    setRestrictions(prev => ({
      ...prev,
      customRestrictions: prev.customRestrictions.filter((_, i) => i !== index)
    }));
  };
  
  // Set avoidance level
  const setAvoidanceLevel = (level: 'strict' | 'moderate' | 'mild') => {
    setRestrictions(prev => ({
      ...prev,
      avoidanceLevel: level
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Allergies & Restrictions</Text>
        <TouchableOpacity 
          onPress={isEditing ? saveRestrictions : () => setIsEditing(true)} 
          style={styles.editButton}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBannerGradient}
          >
            <View style={[styles.headerBannerContent, { backgroundColor: colors.card + '99' }]}>
              <Ionicons name="warning" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Manage your food allergies and dietary restrictions
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Avoidance Level Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Avoidance Level</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.avoidanceLevelContainer}>
                <TouchableOpacity
                  style={[
                    styles.avoidanceButton,
                    restrictions.avoidanceLevel === 'strict' && styles.selectedAvoidance,
                    { 
                      borderColor: colors.border,
                      backgroundColor: restrictions.avoidanceLevel === 'strict' 
                        ? colors.error + '20' 
                        : 'transparent'
                    }
                  ]}
                  onPress={() => isEditing && setAvoidanceLevel('strict')}
                  disabled={!isEditing}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={24} 
                    color={restrictions.avoidanceLevel === 'strict' ? colors.error : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.avoidanceText, 
                      { 
                        color: restrictions.avoidanceLevel === 'strict' 
                          ? colors.error 
                          : colors.text 
                      }
                    ]}
                  >
                    Strict
                  </Text>
                  <Text style={[styles.avoidanceDescription, { color: colors.textSecondary }]}>
                    Avoid completely
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.avoidanceButton,
                    restrictions.avoidanceLevel === 'moderate' && styles.selectedAvoidance,
                    { 
                      borderColor: colors.border,
                      backgroundColor: restrictions.avoidanceLevel === 'moderate' 
                        ? colors.warning + '20' 
                        : 'transparent'
                    }
                  ]}
                  onPress={() => isEditing && setAvoidanceLevel('moderate')}
                  disabled={!isEditing}
                >
                  <Ionicons 
                    name="alert-circle" 
                    size={24} 
                    color={restrictions.avoidanceLevel === 'moderate' ? colors.warning : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.avoidanceText, 
                      { 
                        color: restrictions.avoidanceLevel === 'moderate' 
                          ? colors.warning 
                          : colors.text 
                      }
                    ]}
                  >
                    Moderate
                  </Text>
                  <Text style={[styles.avoidanceDescription, { color: colors.textSecondary }]}>
                    Limit exposure
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.avoidanceButton,
                    restrictions.avoidanceLevel === 'mild' && styles.selectedAvoidance,
                    { 
                      borderColor: colors.border,
                      backgroundColor: restrictions.avoidanceLevel === 'mild' 
                        ? colors.success + '20' 
                        : 'transparent'
                    }
                  ]}
                  onPress={() => isEditing && setAvoidanceLevel('mild')}
                  disabled={!isEditing}
                >
                  <Ionicons 
                    name="information-circle" 
                    size={24} 
                    color={restrictions.avoidanceLevel === 'mild' ? colors.success : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.avoidanceText, 
                      { 
                        color: restrictions.avoidanceLevel === 'mild' 
                          ? colors.success 
                          : colors.text 
                      }
                    ]}
                  >
                    Mild
                  </Text>
                  <Text style={[styles.avoidanceDescription, { color: colors.textSecondary }]}>
                    Be aware only
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Allergies Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Food Allergies</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                Select any food allergies you have. These will be strictly avoided in recommendations.
              </Text>
              <View style={styles.allergensContainer}>
                {COMMON_ALLERGENS.map(allergen => (
                  <TouchableOpacity
                    key={allergen.id}
                    style={[
                      styles.allergenButton,
                      restrictions.allergies.includes(allergen.id) && styles.selectedAllergen,
                      { 
                        borderColor: colors.border,
                        backgroundColor: restrictions.allergies.includes(allergen.id) 
                          ? colors.error + '20' 
                          : 'transparent'
                      }
                    ]}
                    onPress={() => isEditing && toggleAllergen(allergen.id)}
                    disabled={!isEditing}
                  >
                    <Ionicons 
                      name={allergen.icon as any} 
                      size={24} 
                      color={restrictions.allergies.includes(allergen.id) ? colors.error : colors.textSecondary} 
                      style={styles.allergenIcon}
                    />
                    <Text 
                      style={[
                        styles.allergenText, 
                        { 
                          color: restrictions.allergies.includes(allergen.id) 
                            ? colors.error 
                            : colors.text 
                        }
                      ]}
                    >
                      {allergen.name}
                    </Text>
                    {restrictions.allergies.includes(allergen.id) && (
                      <Ionicons name="close-circle" size={16} color={colors.error} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Intolerances Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Food Intolerances</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                Select any food intolerances you have. These will be limited in recommendations.
              </Text>
              <View style={styles.allergensContainer}>
                {COMMON_INTOLERANCES.map(intolerance => (
                  <TouchableOpacity
                    key={intolerance.id}
                    style={[
                      styles.allergenButton,
                      restrictions.intolerances.includes(intolerance.id) && styles.selectedIntolerance,
                      { 
                        borderColor: colors.border,
                        backgroundColor: restrictions.intolerances.includes(intolerance.id) 
                          ? colors.warning + '20' 
                          : 'transparent'
                      }
                    ]}
                    onPress={() => isEditing && toggleIntolerance(intolerance.id)}
                    disabled={!isEditing}
                  >
                    <Ionicons 
                      name={intolerance.icon as any} 
                      size={24} 
                      color={restrictions.intolerances.includes(intolerance.id) ? colors.warning : colors.textSecondary} 
                      style={styles.allergenIcon}
                    />
                    <Text 
                      style={[
                        styles.allergenText, 
                        { 
                          color: restrictions.intolerances.includes(intolerance.id) 
                            ? colors.warning 
                            : colors.text 
                        }
                      ]}
                    >
                      {intolerance.name}
                    </Text>
                    {restrictions.intolerances.includes(intolerance.id) && (
                      <Ionicons name="alert-circle" size={16} color={colors.warning} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Custom Restrictions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Custom Restrictions</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                Add any other foods or ingredients you want to avoid.
              </Text>
              
              {isEditing && (
                <View style={styles.addRestrictionContainer}>
                  <TextInput
                    style={[styles.restrictionInput, { color: colors.text, borderColor: colors.border }]}
                    value={newRestriction}
                    onChangeText={setNewRestriction}
                    placeholder="Add a food or ingredient"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={addCustomRestriction}
                  >
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              
              {restrictions.customRestrictions.length > 0 ? (
                <View style={styles.customRestrictionsList}>
                  {restrictions.customRestrictions.map((restriction, index) => (
                    <View key={index} style={[styles.customRestrictionItem, { backgroundColor: colors.primary + '10' }]}>
                      <Text style={[styles.customRestrictionText, { color: colors.text }]}>{restriction}</Text>
                      {isEditing && (
                        <TouchableOpacity onPress={() => removeCustomRestriction(index)}>
                          <Ionicons name="close-circle" size={20} color={colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No custom restrictions added.
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Your dietary restrictions will be used to filter food recommendations and recipes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  headerBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  headerBannerGradient: {
    borderRadius: 15,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
  headerBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
  },
  headerBannerText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionGradient: {
    marginHorizontal: 16,
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
  sectionContent: {
    borderRadius: 15,
    padding: 16,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  avoidanceLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avoidanceButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedAvoidance: {
    borderWidth: 1,
  },
  avoidanceText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  avoidanceDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  allergenButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  selectedAllergen: {
    borderWidth: 1,
  },
  selectedIntolerance: {
    borderWidth: 1,
  },
  allergenIcon: {
    marginRight: 8,
  },
  allergenText: {
    fontSize: 14,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 4,
  },
  addRestrictionContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  restrictionInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customRestrictionsList: {
    marginTop: 8,
  },
  customRestrictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  customRestrictionText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
