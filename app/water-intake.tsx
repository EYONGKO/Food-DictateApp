import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

// Storage keys
const WATER_GOAL_KEY = '@FoodDictateApp:WaterGoal';
const WATER_INTAKE_KEY = '@FoodDictateApp:WaterIntake';

// Default water goal in ml
const DEFAULT_WATER_GOAL = 2000;

interface WaterIntakeEntry {
  date: string;
  amount: number;
}

export default function WaterIntakeScreen() {
  const { colors } = useTheme();
  const [waterGoal, setWaterGoal] = useState(DEFAULT_WATER_GOAL);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [intakeHistory, setIntakeHistory] = useState<WaterIntakeEntry[]>([]);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Load saved water goal and intake
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load water goal
        const savedGoal = await AsyncStorage.getItem(WATER_GOAL_KEY);
        if (savedGoal) {
          setWaterGoal(parseInt(savedGoal));
        }
        
        // Load water intake history
        const savedIntake = await AsyncStorage.getItem(WATER_INTAKE_KEY);
        if (savedIntake) {
          const intakeData = JSON.parse(savedIntake) as WaterIntakeEntry[];
          setIntakeHistory(intakeData);
          
          // Get today's intake
          const todayEntry = intakeData.find(entry => entry.date === getTodayDate());
          if (todayEntry) {
            setCurrentIntake(todayEntry.amount);
          } else {
            setCurrentIntake(0);
          }
        }
      } catch (error) {
        console.error('Failed to load water data:', error);
      }
    };
    loadData();
  }, []);
  
  // Save water goal
  const saveWaterGoal = async (goal: number) => {
    try {
      await AsyncStorage.setItem(WATER_GOAL_KEY, goal.toString());
      setWaterGoal(goal);
      Alert.alert('Success', 'Your daily water goal has been updated.');
    } catch (error) {
      console.error('Failed to save water goal:', error);
      Alert.alert('Error', 'Failed to save your water goal. Please try again.');
    }
  };
  
  // Add water intake
  const addWaterIntake = async (amount: number) => {
    try {
      const newIntake = currentIntake + amount;
      setCurrentIntake(newIntake);
      
      // Update intake history
      const today = getTodayDate();
      const updatedHistory = [...intakeHistory];
      const todayIndex = updatedHistory.findIndex(entry => entry.date === today);
      
      if (todayIndex >= 0) {
        updatedHistory[todayIndex].amount = newIntake;
      } else {
        updatedHistory.push({ date: today, amount: newIntake });
      }
      
      // Keep only last 7 days
      const sortedHistory = updatedHistory
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);
      
      setIntakeHistory(sortedHistory);
      await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(sortedHistory));
      
      // Show success message if goal reached
      if (currentIntake < waterGoal && newIntake >= waterGoal) {
        Alert.alert('Congratulations!', 'You\'ve reached your daily water intake goal! 🎉');
      }
    } catch (error) {
      console.error('Failed to save water intake:', error);
      Alert.alert('Error', 'Failed to save your water intake. Please try again.');
    }
  };
  
  // Reset today's intake
  const resetTodayIntake = async () => {
    Alert.alert(
      'Reset Today\'s Intake',
      'Are you sure you want to reset your water intake for today?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              const today = getTodayDate();
              const updatedHistory = intakeHistory.filter(entry => entry.date !== today);
              setIntakeHistory(updatedHistory);
              setCurrentIntake(0);
              await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(updatedHistory));
              Alert.alert('Success', 'Your water intake for today has been reset.');
            } catch (error) {
              console.error('Failed to reset water intake:', error);
              Alert.alert('Error', 'Failed to reset your water intake. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return Math.min((currentIntake / waterGoal) * 100, 100);
  };
  
  // Format water amount
  const formatWaterAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}ml`;
  };
  
  // Get day name
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Water Intake</Text>
        <TouchableOpacity onPress={resetTodayIntake} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <LinearGradient
            colors={[colors.primary + 'CC', '#4FC3F7', '#2196F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBannerGradient}
          >
            <View style={[styles.headerBannerContent, { backgroundColor: colors.card + '99' }]}>
              <Ionicons name="water" size={30} color="#2196F3" />
              <Text style={[styles.headerBannerText, { color: colors.text }]}>
                Track your daily water intake
              </Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Today's Progress</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#4FC3F7', '#2196F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                  <Text style={[styles.currentIntake, { color: '#2196F3' }]}>
                    {formatWaterAmount(currentIntake)}
                  </Text>
                  <Text style={[styles.goalText, { color: colors.textSecondary }]}>
                    of {formatWaterAmount(waterGoal)}
                  </Text>
                </View>
                
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${calculateProgress()}%`,
                        backgroundColor: '#2196F3'
                      }
                    ]} 
                  />
                </View>
                
                <Text style={[styles.percentageText, { color: colors.text }]}>
                  {Math.round(calculateProgress())}% of daily goal
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Quick Add Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Quick Add</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#4FC3F7', '#2196F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.quickAddContainer}>
                <TouchableOpacity 
                  style={[styles.quickAddButton, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => addWaterIntake(200)}
                >
                  <Ionicons name="water-outline" size={24} color="#2196F3" />
                  <Text style={[styles.quickAddText, { color: '#2196F3' }]}>200ml</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickAddButton, { backgroundColor: '#BBDEFB' }]}
                  onPress={() => addWaterIntake(350)}
                >
                  <Ionicons name="water-outline" size={24} color="#1E88E5" />
                  <Text style={[styles.quickAddText, { color: '#1E88E5' }]}>350ml</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickAddButton, { backgroundColor: '#90CAF9' }]}
                  onPress={() => addWaterIntake(500)}
                >
                  <Ionicons name="water-outline" size={24} color="#1565C0" />
                  <Text style={[styles.quickAddText, { color: '#1565C0' }]}>500ml</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Set Goal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Set Daily Goal</Text>
          <LinearGradient
            colors={[colors.primary + 'CC', '#4FC3F7', '#2196F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionGradient}
          >
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              <View style={styles.goalSettingContainer}>
                <Text style={[styles.goalSettingText, { color: colors.text }]}>
                  {formatWaterAmount(waterGoal)}
                </Text>
                
                <Slider
                  style={styles.goalSlider}
                  minimumValue={1000}
                  maximumValue={4000}
                  step={100}
                  value={waterGoal}
                  onValueChange={(value) => setWaterGoal(value)}
                  onSlidingComplete={(value) => saveWaterGoal(value)}
                  minimumTrackTintColor="#2196F3"
                  maximumTrackTintColor={colors.border}
                  thumbTintColor="#2196F3"
                />
                
                <View style={styles.sliderLabels}>
                  <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>1L</Text>
                  <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>4L</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* History Section */}
        {intakeHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Recent History</Text>
            <LinearGradient
              colors={[colors.primary + 'CC', '#4FC3F7', '#2196F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionGradient}
            >
              <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
                <View style={styles.historyContainer}>
                  {intakeHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry, index) => (
                      <View key={index} style={styles.historyItem}>
                        <Text style={[styles.historyDay, { color: colors.text }]}>
                          {getDayName(entry.date)}
                        </Text>
                        <View style={[styles.historyBarContainer, { backgroundColor: colors.border }]}>
                          <View 
                            style={[
                              styles.historyBar, 
                              { 
                                width: `${Math.min((entry.amount / waterGoal) * 100, 100)}%`,
                                backgroundColor: '#2196F3'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.historyAmount, { color: colors.textSecondary }]}>
                          {formatWaterAmount(entry.amount)}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Staying hydrated is essential for your health and well-being.
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
  resetButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  progressContainer: {
    alignItems: 'center',
    padding: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currentIntake: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 16,
    marginLeft: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  percentageText: {
    fontSize: 14,
    marginTop: 8,
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  quickAddButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  goalSettingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  goalSettingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalSlider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderLabel: {
    fontSize: 12,
  },
  historyContainer: {
    padding: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDay: {
    width: 40,
    fontSize: 14,
    fontWeight: '500',
  },
  historyBarContainer: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  historyBar: {
    height: '100%',
  },
  historyAmount: {
    width: 50,
    fontSize: 12,
    textAlign: 'right',
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
