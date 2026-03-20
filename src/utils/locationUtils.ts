import * as Location from 'expo-location';
import { LocationPermission } from '../types';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const getLocationPermission = async (): Promise<LocationPermission> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
    };
  } catch (error) {
    console.error('Error getting location permission:', error);
    return { status: 'unknown', granted: false };
  }
};

export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results.length > 0) {
      const address = results[0];
      const addressString = [
        address.name,
        address.street,
        address.city,
        address.region,
        address.country,
      ]
        .filter(Boolean)
        .join(', ');

      return addressString || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};
