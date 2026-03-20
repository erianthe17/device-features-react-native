import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import {
  requestCameraPermission,
  getCameraPermission,
  requestMediaLibraryPermission,
} from '../../utils/cameraUtils';
import {
  requestLocationPermission,
  getCurrentLocation,
  reverseGeocode,
} from '../../utils/locationUtils';
import { sendNotification } from '../../utils/notificationUtils';
import { saveTravelEntry } from '../../utils/storageUtils';
import { validateTravelEntry } from '../../utils/validationUtils';
import { FeedbackModal } from '../../components/Modal/Modal';
import { TravelEntry } from '../../types';
import { TravelEntryScreenStyles as styles } from './TravelEntry.styles';
import { RootStackParamList } from '../../navigation/props';

type TravelEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'AddEntry'>;

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  closeText?: string;
}

export const TravelEntryScreen: React.FC<TravelEntryScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // If there's an image or data, show confirmation
      if (imageUri || address) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        
        // Show confirmation modal
        setModal({
          visible: true,
          title: 'Discard Entry?',
          message: 'You have unsaved changes. Do you want to discard them?',
          type: 'warning',
          confirmText: 'Discard',
          closeText: 'Keep Editing',
          onConfirm: () => {
            clearForm();
            navigation.dispatch(e.data.action);
          },
        });
      }
    });

    return unsubscribe;
  }, [navigation, imageUri, address]);

  const requestPermissions = async () => {
    try {
      const [cameraGranted, locationGranted] = await Promise.all([
        requestCameraPermission(),
        requestLocationPermission(),
      ]);

      if (!cameraGranted) {
        setModal({
          visible: true,
          title: 'Camera Permission',
          message: 'Camera permission is required to take photos',
          type: 'warning',
          confirmText: 'OK',
        });
      }
      if (!locationGranted) {
        setModal({
          visible: true,
          title: 'Location Permission',
          message: 'Location permission is required to save entries',
          type: 'warning',
          confirmText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, visible: false });
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        await getLocationAndAddress();
      }
    } catch (error) {
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to take photo',
        type: 'error',
        confirmText: 'OK',
      });
      console.error('Error taking photo:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request media library permission before opening picker
      const mediaPermissionGranted = await requestMediaLibraryPermission();
      
      if (!mediaPermissionGranted) {
        setModal({
          visible: true,
          title: 'Permission Required',
          message: 'Camera roll/photo library permission is required to pick images from your gallery',
          type: 'warning',
          confirmText: 'OK',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        await getLocationAndAddress();
      }
    } catch (error) {
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to pick image',
        type: 'error',
        confirmText: 'OK',
      });
      console.error('Error picking image:', error);
    }
  };

  const getLocationAndAddress = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        const { latitude: lat, longitude: lng } = location.coords;
        setLatitude(lat);
        setLongitude(lng);

        const addressResult = await reverseGeocode(lat, lng);
        setAddress(addressResult || 'Address not found');
      } else {
        setModal({
          visible: true,
          title: 'Error',
          message: 'Could not retrieve location',
          type: 'error',
          confirmText: 'OK',
        });
      }
    } catch (error) {
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to get location',
        type: 'error',
        confirmText: 'OK',
      });
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    const validation = validateTravelEntry(imageUri, address, latitude, longitude);

    if (!validation.valid) {
      setModal({
        visible: true,
        title: 'Validation Error',
        message: validation.error,
        type: 'error',
        confirmText: 'OK',
      });
      return;
    }

    setIsLoading(true);
    try {
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        imageUri: imageUri!,
        address,
        latitude: latitude!,
        longitude: longitude!,
        timestamp: Date.now(),
      };

      await saveTravelEntry(newEntry);
      await sendNotification(
        'Travel Entry Saved',
        `Your travel entry has been saved: ${address}`
      );

      setModal({
        visible: true,
        title: 'Success',
        message: 'Travel entry saved successfully',
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => {
          clearForm();
          // Call onSuccess callback if provided
          if (route.params?.onSuccess) {
            route.params.onSuccess();
          }
          // Navigate back to home
          navigation.navigate('HomeList');
        },
      });
    } catch (error) {
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to save travel entry',
        type: 'error',
        confirmText: 'OK',
      });
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const clearForm = () => {
    setImageUri(null);
    setAddress('');
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Add Travel Entry</Text>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Pressable
            style={({ pressed }) => [
              styles.changeImageButton,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.buttonText}>Change Photo</Text>
          </Pressable>
        </View>
      )}

      {!imageUri && (
        <View style={styles.imageActionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handlePickImage}
          >
            <Text style={styles.buttonText}>Pick from Gallery</Text>
          </Pressable>
        </View>
      )}

      {imageUri && (
        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Address:</Text>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {address || 'Fetching location...'}
              </Text>
              {latitude && longitude && (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>Coordinates:</Text>
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      )}

      {imageUri && (
        <View style={styles.saveContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.saveButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSaveEntry}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Save Entry</Text>
            )}
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.cancelButton,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleGoBack}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </Pressable>
        </View>
      )}

      <FeedbackModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText || 'OK'}
        closeText={modal.closeText}
        backgroundColor={colors.card}
        textColor={colors.text}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
      />
    </ScrollView>
  );
};
