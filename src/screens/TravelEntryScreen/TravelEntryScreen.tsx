import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UNSTABLE_usePreventRemove as usePreventRemove } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { requestCameraPermission, requestMediaLibraryPermission } from '../../utils/cameraUtils';
import { requestLocationPermission, getCurrentLocation, reverseGeocode } from '../../utils/locationUtils';
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
  const defaultModalState: ModalState = {
    visible: false,
    title: '',
    message: '',
    type: 'info',
  };
  const { colors } = useTheme();
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);
  const [modal, setModal] = useState<ModalState>(defaultModalState);
  const skipDiscardPromptRef = useRef(false);
  const hasUnsavedChanges = imageUris.length > 0 || address.trim().length > 0;

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (!shouldNavigateHome) {
      return;
    }

    navigation.navigate('HomeList');
  }, [navigation, shouldNavigateHome]);

  usePreventRemove(hasUnsavedChanges && !skipDiscardPromptRef.current, ({ data }) => {
    setModal({
      visible: true,
      title: 'Discard Entry?',
      message: 'You have unsaved changes. Do you want to discard them?',
      type: 'warning',
      confirmText: 'Discard',
      closeText: 'Keep Editing',
      onConfirm: () => {
        skipDiscardPromptRef.current = true;
        clearForm();
        navigation.dispatch(data.action);
      },
    });
  });

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
    setModal(defaultModalState);
  };

  const parseExifCoordinate = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      const directValue = Number(trimmedValue);
      if (Number.isFinite(directValue)) {
        return directValue;
      }

      const parts = trimmedValue.split(',').map((part) => part.trim()).filter(Boolean);
      if (parts.length > 0) {
        const convertedParts = parts.map((part) => {
          const [numerator, denominator] = part.split('/');
          if (!denominator) {
            const numericPart = Number(part);
            return Number.isFinite(numericPart) ? numericPart : null;
          }

          const parsedNumerator = Number(numerator);
          const parsedDenominator = Number(denominator);
          if (!Number.isFinite(parsedNumerator) || !Number.isFinite(parsedDenominator) || parsedDenominator === 0) {
            return null;
          }

          return parsedNumerator / parsedDenominator;
        });

        if (convertedParts.every((part) => part !== null)) {
          const [degrees = 0, minutes = 0, seconds = 0] = convertedParts as number[];
          return degrees + minutes / 60 + seconds / 3600;
        }
      }
    }

    if (Array.isArray(value) && value.length > 0) {
      const convertedParts = value.map((part) => parseExifCoordinate(part));
      if (convertedParts.every((part) => part !== null)) {
        const [degrees = 0, minutes = 0, seconds = 0] = convertedParts as number[];
        return degrees + minutes / 60 + seconds / 3600;
      }
    }

    return null;
  };

  const getCoordinatesFromAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const exif = asset.exif;
    if (!exif) {
      return null;
    }

    const latitudeValue = parseExifCoordinate(exif.GPSLatitude ?? exif.latitude);
    const longitudeValue = parseExifCoordinate(exif.GPSLongitude ?? exif.longitude);

    if (latitudeValue === null || longitudeValue === null) {
      return null;
    }

    const latitudeRef = typeof exif.GPSLatitudeRef === 'string' ? exif.GPSLatitudeRef.toUpperCase() : '';
    const longitudeRef = typeof exif.GPSLongitudeRef === 'string' ? exif.GPSLongitudeRef.toUpperCase() : '';

    return {
      latitude: latitudeRef === 'S' ? -Math.abs(latitudeValue) : Math.abs(latitudeValue),
      longitude: longitudeRef === 'W' ? -Math.abs(longitudeValue) : Math.abs(longitudeValue),
    };
  };

  const mergeImageUris = (nextUris: string[], focusNewest = false) => {
    setImageUris((currentUris) => {
      const mergedUris = Array.from(new Set([...currentUris, ...nextUris.filter(Boolean)]));
      if (focusNewest && mergedUris.length > currentUris.length) {
        setSelectedImageIndex(currentUris.length);
      } else if (currentUris.length === 0 && mergedUris.length > 0) {
        setSelectedImageIndex(0);
      }
      return mergedUris;
    });
  };

  const updateLocationForAssets = async (assets: ImagePicker.ImagePickerAsset[]) => {
    setIsLoading(true);
    try {
      const assetCoordinates = assets
        .map((asset) => getCoordinatesFromAsset(asset))
        .find((coordinates) => coordinates !== null);
      let latitudeValue = assetCoordinates?.latitude ?? null;
      let longitudeValue = assetCoordinates?.longitude ?? null;

      if (latitudeValue === null || longitudeValue === null) {
        const currentLocation = await getCurrentLocation();
        latitudeValue = currentLocation?.coords.latitude ?? null;
        longitudeValue = currentLocation?.coords.longitude ?? null;
      }

      if (latitudeValue === null || longitudeValue === null) {
        setModal({
          visible: true,
          title: 'Location Unavailable',
          message: 'We could not read location data from the selected photos or your current device location.',
          type: 'warning',
          confirmText: 'OK',
        });
        return;
      }

      setLatitude(latitudeValue);
      setLongitude(longitudeValue);

      const addressResult = await reverseGeocode(latitudeValue, longitudeValue);
      setAddress(addressResult || `${latitudeValue.toFixed(4)}, ${longitudeValue.toFixed(4)}`);
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

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        mergeImageUris(result.assets.map((asset) => asset.uri), true);
        await updateLocationForAssets(result.assets);
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
        allowsMultipleSelection: true,
        orderedSelection: true,
        selectionLimit: 0,
        quality: 1,
        exif: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        mergeImageUris(result.assets.map((asset) => asset.uri), true);
        await updateLocationForAssets(result.assets);
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

  const handleSaveEntry = async () => {
    const validation = validateTravelEntry(imageUris, address, latitude, longitude);

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
        imageUri: imageUris[0],
        imageUris,
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
          skipDiscardPromptRef.current = true;
          clearForm();
          closeModal();
          route.params?.onSuccess?.();
          setShouldNavigateHome(true);
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
    setImageUris([]);
    setSelectedImageIndex(0);
    setAddress('');
    setLatitude(null);
    setLongitude(null);
  };

  const selectedImageUri = imageUris[selectedImageIndex] || imageUris[0];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Add Travel Entry</Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Capture a photo of your travel location and we'll automatically get the address for you
      </Text>

      {imageUris.length > 0 && (
        <View style={styles.imageContainer}>
          {selectedImageUri ? <Image source={{ uri: selectedImageUri }} style={styles.image} /> : null}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          >
            {imageUris.map((uri, index) => (
              <Pressable
                key={`${uri}-${index}`}
                style={[
                  styles.thumbnailButton,
                  index === selectedImageIndex && { borderColor: colors.primary },
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image source={{ uri }} style={styles.thumbnailImage} />
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            style={({ pressed }) => [
              styles.changeImageButton,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handlePickImage}
          >
            <Text style={styles.buttonText}>Add More Photos</Text>
          </Pressable>
        </View>
      )}

      {imageUris.length === 0 && (
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

      {imageUris.length > 0 && (
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

      {imageUris.length > 0 && (
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
