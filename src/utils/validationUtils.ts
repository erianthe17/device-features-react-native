export const validateTravelEntry = (
  imageUri: string | null,
  address: string,
  latitude: number | null,
  longitude: number | null
): { valid: boolean; error: string } => {
  if (!imageUri) {
    return { valid: false, error: 'Please take or select a photo' };
  }

  if (!address || address.trim().length === 0) {
    return { valid: false, error: 'Address could not be determined' };
  }

  if (latitude === null || longitude === null) {
    return { valid: false, error: 'Location coordinates not available' };
  }

  return { valid: true, error: '' };
};

export const validateImage = (uri: string): boolean => {
  return !!(uri && uri.length > 0);
};

export const validateAddress = (address: string): boolean => {
  return !!(address && address.trim().length > 0);
};

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};
