import * as ImagePicker from 'expo-image-picker';
import { CameraPermission } from '../types';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.granted && mediaLibraryPermission.granted;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const getCameraPermission = async (): Promise<CameraPermission> => {
  try {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    return {
      status: permission.status,
      granted: permission.granted,
    };
  } catch (error) {
    console.error('Error getting camera permission:', error);
    return { status: 'unknown', granted: false };
  }
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
};

export const getMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Error getting media library permission:', error);
    return false;
  }
};
