import * as Notifications from 'expo-notifications';
import { NotificationPermission } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const getNotificationPermission = async (): Promise<NotificationPermission> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
    };
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return { status: 'unknown', granted: false };
  }
};

export const sendNotification = async (title: string, body: string) => {
  try {
    const permission = await getNotificationPermission();
    if (!permission.granted) {
      console.warn('Notification permission not granted');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        badge: 1,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
