export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface CameraPermission {
  status: string;
  granted: boolean;
}

export interface LocationPermission {
  status: string;
  granted: boolean;
}

export interface NotificationPermission {
  status: string;
  granted: boolean;
}
