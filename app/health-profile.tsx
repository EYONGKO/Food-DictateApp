import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

// Storage key
const HEALTH_PROFILE_KEY = '@FoodDictateApp:HealthProfile';

// Default health profile
const DEFAULT_PROFILE = {
  age: 30,
  gender: 'male',
  height: 170, // cm
  weight: 70, // kg
  goalWeight: 65, // kg
  medicalConditions: [] as string[],
  isPregnant: false,
  isLactating: false,
  hasDiabetes: false,
  hasHeartDisease: false,
  hasHighBloodPressure: false,
};

interface HealthProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goalWeight: number;
  medicalConditions: string[];
  isPregnant: boolean;
  isLactating: boolean;
  hasDiabetes: boolean;
  hasHeartDisease: boolean;
  hasHighBloodPressure: boolean;
}

export default function HealthProfileScreen() {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<HealthProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [newCondition, setNewCondition] = useState('');

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(HEALTH_PROFILE_KEY);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Failed to load health profile:', error);
      }
    };
    loadProfile();
  }, []);

  // Save profile
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem(HEALTH_PROFILE_KEY, JSON.stringify(profile));
      Alert.alert('Success', 'Your health profile has been saved.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save health profile:', error);
      Alert.alert('Error', 'Failed to save your health profile. Please try again.');
    }
  };

  // Handle text input change
  const handleTextChange = (name: keyof HealthProfile, value: string) => {
    const numValue = parseInt(value) || 0;
    setProfile(prev => ({ ...prev, [name]: numValue }));
  };

  // Handle switch toggle
  const handleToggle = (name: keyof HealthProfile) => {
    setProfile(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // Add medical condition
  const addMedicalCondition = () => {
    if (newCondition.trim() === '') return;
    
    setProfile(prev => ({
      ...prev,
      medicalConditions: [...prev.medicalConditions, newCondition.trim()]
    }));
    setNewCondition('');
  };

  // Remove medical condition
  const removeMedicalCondition = (index: number) => {
    setProfile(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index)
    }));
  };

  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Profile</Text>
        <TouchableOpacity 
          onPress={isEditing ? saveProfile : () => setIsEditing(true)} 
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
              <Ionicons name="body" size={30} color={colors.primary} />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Your personal health information
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Basic Information</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {/* Age */}
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Age</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    value={profile.age.toString()}
                    onChangeText={(text) => handleTextChange('age', text)}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.primary }]}>{profile.age} years</Text>
                )}
              </View>
              
              {/* Gender */}
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Gender</Text>
                {isEditing ? (
                  <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
                    <Picker
                      selectedValue={profile.gender}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                      style={styles.picker}
                    >
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.primary }]}>
                    {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </Text>
                )}
              </View>
              
              {/* Height */}
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Height</Text>
                {isEditing ? (
                  <View style={styles.inputWithUnit}>
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                      value={profile.height.toString()}
                      onChangeText={(text) => handleTextChange('height', text)}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.unitText, { color: colors.textSecondary }]}>cm</Text>
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.primary }]}>{profile.height} cm</Text>
                )}
              </View>
              
              {/* Weight */}
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Current Weight</Text>
                {isEditing ? (
                  <View style={styles.inputWithUnit}>
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                      value={profile.weight.toString()}
                      onChangeText={(text) => handleTextChange('weight', text)}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.unitText, { color: colors.textSecondary }]}>kg</Text>
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.primary }]}>{profile.weight} kg</Text>
                )}
              </View>
              
              {/* Goal Weight */}
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Goal Weight</Text>
                {isEditing ? (
                  <View style={styles.inputWithUnit}>
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                      value={profile.goalWeight.toString()}
                      onChangeText={(text) => handleTextChange('goalWeight', text)}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.unitText, { color: colors.textSecondary }]}>kg</Text>
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.primary }]}>{profile.goalWeight} kg</Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* BMI Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Body Mass Index (BMI)</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.bmiContainer}>
                <View style={styles.bmiValueContainer}>
                  <Text style={[styles.bmiValue, { color: colors.primary }]}>{calculateBMI()}</Text>
                  <Text style={[styles.bmiCategory, { color: colors.text }]}>{getBMICategory()}</Text>
                </View>
                <Text style={[styles.bmiDescription, { color: colors.textSecondary }]}>
                  BMI is a measure of body fat based on height and weight.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Medical Conditions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Medical Conditions</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {/* Common conditions as toggles */}
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Diabetes</Text>
                <Switch
                  value={profile.hasDiabetes}
                  onValueChange={() => handleToggle('hasDiabetes')}
                  disabled={!isEditing}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Heart Disease</Text>
                <Switch
                  value={profile.hasHeartDisease}
                  onValueChange={() => handleToggle('hasHeartDisease')}
                  disabled={!isEditing}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>High Blood Pressure</Text>
                <Switch
                  value={profile.hasHighBloodPressure}
                  onValueChange={() => handleToggle('hasHighBloodPressure')}
                  disabled={!isEditing}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
              
              {profile.gender === 'female' && (
                <>
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>Pregnant</Text>
                    <Switch
                      value={profile.isPregnant}
                      onValueChange={() => handleToggle('isPregnant')}
                      disabled={!isEditing}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.background}
                    />
                  </View>
                  
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>Lactating</Text>
                    <Switch
                      value={profile.isLactating}
                      onValueChange={() => handleToggle('isLactating')}
                      disabled={!isEditing}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.background}
                    />
                  </View>
                </>
              )}
              
              {/* Other medical conditions */}
              <Text style={[styles.subSectionTitle, { color: colors.text }]}>Other Conditions</Text>
              
              {profile.medicalConditions.length > 0 ? (
                <View style={styles.conditionsList}>
                  {profile.medicalConditions.map((condition, index) => (
                    <View key={index} style={styles.conditionItem}>
                      <Text style={[styles.conditionText, { color: colors.text }]}>{condition}</Text>
                      {isEditing && (
                        <TouchableOpacity onPress={() => removeMedicalCondition(index)}>
                          <Ionicons name="close-circle" size={20} color={colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No other medical conditions added.
                </Text>
              )}
              
              {isEditing && (
                <View style={styles.addConditionContainer}>
                  <TextInput
                    style={[styles.conditionInput, { color: colors.text, borderColor: colors.border }]}
                    value={newCondition}
                    onChangeText={setNewCondition}
                    placeholder="Add a medical condition"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={addMedicalCondition}
                  >
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            This information helps us provide personalized nutrition recommendations.
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
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    width: 120,
  },
  picker: {
    width: 120,
    height: 40,
  },
  bmiContainer: {
    alignItems: 'center',
    padding: 16,
  },
  bmiValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  bmiDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  conditionsList: {
    marginTop: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  addConditionContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  conditionInput: {
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
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
