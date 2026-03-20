import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { getAllTravelEntries, deleteTravelEntry } from '../../utils/storageUtils';
import { TravelEntry } from '../../types';
import { ViewEntryScreenStyles as styles } from './ViewEntryScreen.styles';
import { RootStackParamList } from '../../navigation/props';

type ViewEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'ViewEntry'>;

export const ViewEntryScreen: React.FC<ViewEntryScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { entryId } = route.params;
  const [entry, setEntry] = useState<TravelEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    try {
      setIsLoading(true);
      const entries = await getAllTravelEntries();
      const foundEntry = entries.find((e) => e.id === entryId);
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        Alert.alert('Error', 'Entry not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading entry:', error);
      Alert.alert('Error', 'Failed to load entry');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteTravelEntry(entryId);
            Alert.alert('Success', 'Entry deleted successfully', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          } catch (error) {
            console.error('Error deleting entry:', error);
            Alert.alert('Error', 'Failed to delete entry');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Entry not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: entry.imageUri }} style={styles.image} />
      </View>

      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
        <Text style={[styles.addressText, { color: colors.text }]}>
          {entry.address}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
          Coordinates
        </Text>
        <View style={styles.coordinatesGrid}>
          <View style={styles.coordinateItem}>
            <Text style={[styles.coordinateLabel, { color: colors.text }]}>Latitude</Text>
            <Text style={[styles.coordinateValue, { color: colors.primary }]}>
              {entry.latitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.coordinateItem}>
            <Text style={[styles.coordinateLabel, { color: colors.text }]}>Longitude</Text>
            <Text style={[styles.coordinateValue, { color: colors.primary }]}>
              {entry.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
          Date & Time
        </Text>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {new Date(entry.timestamp).toLocaleDateString()} at{' '}
          {new Date(entry.timestamp).toLocaleTimeString()}
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.deleteButton, { backgroundColor: colors.secondary }]}
            onPress={handleDeleteEntry}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="delete-outline" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Delete Entry</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
            disabled={isDeleting}
          >
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};
