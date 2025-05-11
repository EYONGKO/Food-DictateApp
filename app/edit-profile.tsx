import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, Alert, ScrollView, Image } from 'react-native'; // Import Image
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import Theme and Translation hooks
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Reuse or define COLORS
const COLORS = {
  primary: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#A0A0A0',
  lightGrey: '#f0f0f0',
  darkGrey: '#333333',
  red: '#F44336',
};

// Key for storing user profile data
const USER_PROFILE_STORAGE_KEY = '@FoodDictateApp:UserProfile';

interface UserProfile {
  name: string;
  email: string;
  imageUri?: string | null;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Effects --- 
  // Load existing profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const storedProfile = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
        if (storedProfile) {
          const profile: UserProfile = JSON.parse(storedProfile);
          setName(profile.name || ""); // Default to empty string if null/undefined
          setEmail(profile.email || "");
          setImageUri(profile.imageUri || null);
        } else {
            // Set default placeholders if nothing is saved
            setName("Alex Johnson"); // Placeholder
            setEmail("alex.johnson@email.com"); // Placeholder
        }
      } catch (e) {
        console.error("Failed to load profile data.", e);
        // Handle error - maybe set default placeholders
         setName("Alex Johnson"); // Placeholder
         setEmail("alex.johnson@email.com"); // Placeholder
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  // --- Handlers --- 
  const handleSaveChanges = async () => {
    const profileToSave: UserProfile = { name, email, imageUri };
    try {
      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
      Alert.alert(t('editProfile.saveSuccessTitle'), t('editProfile.saveSuccessMessage'), [
          { text: t('common.ok'), onPress: () => router.back() } 
      ]);
    } catch (e) {
      console.error("Failed to save profile data.", e);
      Alert.alert(t('editProfile.saveErrorTitle'), t('editProfile.saveErrorMessage'));
    }
  };

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('editProfile.permissionDeniedTitle'), t('editProfile.permissionDeniedMessage'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.6, // Reduce quality slightly to save space
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- Render --- 
  if (isLoading) {
     // Optional: Show a loading indicator fullscreen
     return (
         <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{ color: colors.textSecondary }}>{t('common.loading')}</Text>
         </SafeAreaView>
     );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.background }]}>{t('editProfile.title')}</Text>
        <View style={{ width: 40 }}/>{/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
         {/* Avatar Section */}
         <View style={[styles.avatarSection, { backgroundColor: colors.card }]}>
             <TouchableOpacity onPress={pickImage} style={[styles.avatarContainer, { backgroundColor: colors.iconBackground, borderColor: colors.primary }]}>
                 {imageUri ? (
                     <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                 ) : (
                    <Text style={[styles.avatarText, { color: colors.primary }]}>?</Text> // Or an icon
                 )}
                 {/* Optional: Add an edit icon overlay */}
                 <View style={[styles.editIconOverlay, { borderColor: colors.background }]}>
                     <Ionicons name="camera-outline" size={18} color={colors.background} />
                 </View>
             </TouchableOpacity>
             <TouchableOpacity onPress={pickImage}>
                 <Text style={[styles.changeAvatarText, { color: colors.primary }]}>{t('editProfile.changePhoto')}</Text>
             </TouchableOpacity>
         </View>

         {/* Form Fields */}
         <View style={[styles.formSection, { backgroundColor: colors.card }]}>
             <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('editProfile.nameLabel')}</Text>
             <TextInput
                 style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                 value={name}
                 onChangeText={setName}
                 placeholder={t('editProfile.namePlaceholder')}
                 placeholderTextColor={colors.textSecondary}
             />

             <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('editProfile.emailLabel')}</Text>
              <TextInput
                 style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                 value={email}
                 onChangeText={setEmail}
                 placeholder={t('editProfile.emailPlaceholder')}
                 placeholderTextColor={colors.textSecondary}
                 keyboardType="email-address"
                 autoCapitalize="none"
             />
         </View>
      </ScrollView>

      {/* Save Button Fixed at Bottom */}
      <View style={[styles.saveButtonContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>{t('editProfile.saveButton')}</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor applied inline via theme
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    // backgroundColor applied inline via theme
  },
   headerButton: {
     padding: 5,
   },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color applied inline via theme
  },
  scrollContent: {
      paddingBottom: 100, // Ensure space for the fixed save button
  },
  avatarSection: {
     alignItems: 'center',
     paddingVertical: 20,
     marginBottom: 15,
     // backgroundColor applied inline via theme
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    // borderColor: theme.primary applied inline
    position: 'relative', // Needed for icon overlay
    overflow: 'hidden', // Clip image to circle
  },
  avatarImage: {
      width: '100%',
      height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    // color: theme.primary applied inline
  },
  editIconOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 5,
      borderRadius: 15,
      borderWidth: 1,
  },
  changeAvatarText: {
     fontSize: 14,
     fontWeight: 'bold',
     // color: theme.primary applied inline
  },
  formSection: {
     paddingHorizontal: 20,
     paddingVertical: 10,
     marginHorizontal: 10,
     borderRadius: 10,
     // backgroundColor applied inline via theme
  },
  inputLabel: {
     fontSize: 14,
     marginBottom: 5,
     marginTop: 15,
     // color applied inline via theme
  },
  input: {
     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
     fontSize: 16,
     borderBottomWidth: 1,
     // color applied inline via theme
     // borderBottomColor applied inline via theme
  },
  saveButtonContainer: {
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     padding: 20,
     borderTopWidth: 1,
     // backgroundColor applied inline via theme
     // borderTopColor applied inline via theme
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    // backgroundColor applied inline via theme
  },
  saveButtonText: {
    color: '#FFFFFF', // Explicitly white
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 