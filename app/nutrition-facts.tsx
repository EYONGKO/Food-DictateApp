import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function NutritionFactsScreen() {
    const router = useRouter();
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       {/* <Stack.Screen options={{ title: 'Nutrition Facts' }} /> */}
       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close-circle" size={30} color="#888" />
       </TouchableOpacity>
      <Text style={{fontSize: 18}}>Nutrition Facts Screen</Text>
      <Text style={{color: '#888'}}>(Placeholder)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 50,
        left: 15,
        zIndex: 1,
    }
}); 