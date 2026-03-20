import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types';

const STORAGE_KEY = 'travel_entries';

export const saveTravelEntry = async (entry: TravelEntry): Promise<void> => {
  try {
    const existingEntries = await getAllTravelEntries();
    const updatedEntries = [entry, ...existingEntries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error saving travel entry:', error);
    throw error;
  }
};

export const getAllTravelEntries = async (): Promise<TravelEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving travel entries:', error);
    return [];
  }
};

export const deleteTravelEntry = async (entryId: string): Promise<void> => {
  try {
    const entries = await getAllTravelEntries();
    const filteredEntries = entries.filter((entry) => entry.id !== entryId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting travel entry:', error);
    throw error;
  }
};

export const clearAllEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing entries:', error);
    throw error;
  }
};
