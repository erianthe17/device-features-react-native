import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { getAllTravelEntries, deleteTravelEntry } from '../../utils/storageUtils';
import { sendNotification } from '../../utils/notificationUtils';
import { FeedbackModal } from '../../components/Modal/Modal';
import { TravelEntry } from '../../types';
import { ViewEntryScreenStyles as styles } from './ViewEntryScreen.styles';
import { ViewEntryScreenProps } from '../../navigation/props';
import { createDefaultModalState, FeedbackModalState } from '../../utils/modalUtils';

export const ViewEntryScreen: React.FC<ViewEntryScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { entryId } = route.params;
  const [entry, setEntry] = useState<TravelEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modal, setModal] = useState<FeedbackModalState>(createDefaultModalState);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [entry?.id]);

  const loadEntry = async () => {
    try {
      setIsLoading(true);
      const entries = await getAllTravelEntries();
      const foundEntry = entries.find((e) => e.id === entryId);
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        setModal({
          visible: true,
          title: 'Error',
          message: 'Entry not found',
          type: 'error',
          confirmText: 'OK',
          onConfirm: () => navigation.goBack(),
        });
      }
    } catch (error) {
      console.error('Error loading entry:', error);
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to load entry',
        type: 'error',
        confirmText: 'OK',
        onConfirm: () => navigation.goBack(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModal(createDefaultModalState());
  };

  const handleDeleteEntry = () => {
    setModal({
      visible: true,
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      type: 'warning',
      confirmText: 'Delete',
      closeText: 'Cancel',
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          closeModal();
          await deleteTravelEntry(entryId);
          await sendNotification('Entry Deleted', 'Travel entry deleted successfully');
          navigation.navigate('HomeList');
        } catch (error) {
          console.error('Error deleting entry:', error);
          setModal({
            visible: true,
            title: 'Error',
            message: 'Failed to delete entry',
            type: 'error',
            confirmText: 'OK',
          });
        } finally {
          setIsDeleting(false);
        }
      },
    });
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

  const imageUris = entry.imageUris.length > 0 ? entry.imageUris : entry.imageUri ? [entry.imageUri] : [];
  const selectedImageUri = imageUris[selectedImageIndex] || imageUris[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {selectedImageUri ? <Image source={{ uri: selectedImageUri }} style={styles.image} /> : null}
        </View>
        {imageUris.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          >
            {imageUris.map((imageUri, index) => (
              <Pressable
                key={`${imageUri}-${index}`}
                style={[
                  styles.thumbnailButton,
                  index === selectedImageIndex && { borderColor: colors.primary },
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image source={{ uri: imageUri }} style={styles.thumbnailImage} />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.detailsContainer}>
          <View
            style={[
              styles.detailCard,
              styles.fullWidthCard,
              { borderColor: colors.border, backgroundColor: 'transparent' },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
            <Text style={[styles.addressText, { color: colors.text }]}>
              {entry.address}
            </Text>
          </View>

          <View style={styles.detailGrid}>
            <View
              style={[
                styles.detailCard,
                { borderColor: colors.border, backgroundColor: 'transparent' },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Latitude</Text>
              <Text style={[styles.coordinateValue, { color: colors.primary }]}>
                {entry.latitude.toFixed(6)}
              </Text>
            </View>

            <View
              style={[
                styles.detailCard,
                { borderColor: colors.border, backgroundColor: 'transparent' },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Longitude</Text>
              <Text style={[styles.coordinateValue, { color: colors.primary }]}>
                {entry.longitude.toFixed(6)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.detailCard,
              styles.fullWidthCard,
              { borderColor: colors.border, backgroundColor: 'transparent' },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Date & Time
            </Text>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {new Date(entry.timestamp).toLocaleDateString()} at{' '}
              {new Date(entry.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonFooter, { borderTopColor: colors.border }]}>
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
      </View>

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
    </View>
  );
};
