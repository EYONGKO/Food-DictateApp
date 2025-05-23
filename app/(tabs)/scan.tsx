import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, AppState, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [appState, setAppState] = useState(AppState.currentState);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    requestPermission();
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => { subscription.remove(); };
  }, []);

  const handleAppStateChange = async (nextAppState: any) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (!permission?.granted) {
        await requestPermission();
      }
    }
    setAppState(nextAppState);
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if (photo?.uri) {
          router.push({ pathname: '/scan-results', params: { imageUri: photo.uri } });
        } else {
          console.log('Photo capture failed.');
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    } else {
      console.log('Camera not ready or ref not set');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert(t('editProfile.permissionDeniedMessage'));
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        router.push({ pathname: '/scan-results', params: { imageUri: result.assets[0].uri } });
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.permissionCardGradient}
        >
          <LinearGradient
            colors={[colors.card, colors.card + '99']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.permissionCard, { borderColor: 'transparent' }]}
          >
            <Text style={[styles.permissionText, { color: colors.text }]}>{t('scan.permissionText')}</Text>

            <TouchableOpacity style={styles.buttonContainer} onPress={requestPermission}>
              <LinearGradient
                colors={[colors.primary, colors.primary + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionButtonText}>{t('scan.grantPermission')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backButtonPerm}>
              <Text style={[styles.backButtonTextPerm, { color: colors.primary }]}>{t('common.goBack')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background + '80' }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Camera</Text>
        <View style={{ width: 28 }} />
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={'back'}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.overlayContainer}>
          <Text style={[styles.centerText, { color: '#FFFFFF' }]}>Position food in Frame</Text>
          <View style={[styles.focusFrame, { borderColor: colors.primary }]}>
            <View style={[styles.horizontalLine, { backgroundColor: colors.primary }]} />
          </View>
        </View>
      </CameraView>

      <LinearGradient
        colors={[colors.primary + 'CC', '#FF6B6B', '#FFD166']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomSheetGradient}
      >
        <LinearGradient
          colors={[colors.card, colors.card + '99']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bottomSheet, { borderColor: 'transparent' }]}
        >
          <Text style={[styles.sheetTitle, { color: colors.text }]}>Scan Food</Text>
          <Text style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>Take a photo of your food to identify ingredients</Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={takePicture}
            disabled={!isCameraReady}
          >
            <LinearGradient
              colors={[colors.primary, colors.primary + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.captureButton,
                !isCameraReady && styles.disabledButton
              ]}
            >
              <Text style={styles.captureButtonText}>Capture</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={pickImage}
          >
            <LinearGradient
              colors={[colors.primary, colors.primary + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.galleryButton}
            >
              <Text style={styles.galleryButtonText}>Choose from gallery</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    </SafeAreaView>
  );
}

const frameHeightRatio = 0.4;
const frameWidthRatio = 0.8;
const frameVerticalPosition = 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionCardGradient: {
    width: '90%',
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  permissionCard: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
  },
  permissionButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButtonPerm: {
    padding: 10,
    marginTop: 10,
  },
  backButtonTextPerm: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    top: Platform.OS === 'android' ? 10 : 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  focusFrame: {
    width: width * frameWidthRatio,
    height: height * frameHeightRatio,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: (height * (frameVerticalPosition - 0.5)) + 30,
  },
  horizontalLine: {
    position: 'absolute',
    height: 2,
    width: '80%',
    alignSelf: 'center',
  },
  bottomSheetGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  bottomSheet: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 80 : 70,
    paddingHorizontal: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  captureButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  galleryButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  galleryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});