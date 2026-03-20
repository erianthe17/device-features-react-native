export const validateTravelEntry = (
  imageUris: string[],
  address: string,
  latitude: number | null,
  longitude: number | null
): { valid: boolean; error: string } => {
  if (!Array.isArray(imageUris) || imageUris.length === 0) {
    return { valid: false, error: 'Please take or select at least one photo' };
  }

  if (!address || address.trim().length === 0) {
    return { valid: false, error: 'Address could not be determined' };
  }

  if (latitude === null || longitude === null) {
    return { valid: false, error: 'Location coordinates not available' };
  }

  return { valid: true, error: '' };
};
