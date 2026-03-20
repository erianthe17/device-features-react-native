import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { getAllTravelEntries, deleteTravelEntry } from '../../utils/storageUtils';
import { sendNotification } from '../../utils/notificationUtils';
import { TravelEntry } from '../../types';
import { TravelEntryCard } from '../../components/TravelEntryCard/TravelEntryCard';
import { FeedbackModal } from '../../components/Modal/Modal';
import { HomeScreenStyles as styles } from './HomeScreen.styles';
import { HomeScreenProps } from '../../navigation/props';
import { createDefaultModalState, FeedbackModalState } from '../../utils/modalUtils';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState<FeedbackModalState>(createDefaultModalState);

  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const loadedEntries = await getAllTravelEntries();
      setEntries(loadedEntries);
    } catch (error) {
      setModal({
        visible: true,
        title: 'Error',
        message: 'Failed to load travel entries',
        type: 'error',
        confirmText: 'OK',
      });
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const closeModal = () => {
    setModal(createDefaultModalState());
  };

  const handleDeleteEntry = (entryId: string) => {
    setModal({
      visible: true,
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      type: 'warning',
      confirmText: 'Delete',
      closeText: 'Cancel',
      onConfirm: async () => {
        try {
          closeModal();
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
          await deleteTravelEntry(entryId);
          await sendNotification('Entry Deleted', 'Travel entry deleted successfully');
        } catch (error) {
          await loadEntries();
          setModal({
            visible: true,
            title: 'Error',
            message: 'Failed to delete entry',
            type: 'error',
            confirmText: 'OK',
          });
          console.error('Error deleting entry:', error);
        }
      },
    });
  };

  const renderEntryItem = ({ item }: { item: TravelEntry }) => (
    <TravelEntryCard
      entry={item}
      onDelete={handleDeleteEntry}
      onPress={(entryId) => navigation.navigate('ViewEntry', { entryId })}
      backgroundColor={colors.card}
      borderColor={colors.border}
      textColor={colors.text}
      secondaryColor={colors.secondary}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>No Entries yet</Text>
      <Text style={[styles.emptySubText, { color: colors.text }]}>
        Start by adding your first travel entry
      </Text>
    </View>
  );

  if (isLoading && entries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={entries}
        renderItem={renderEntryItem}
        keyExtractor={(item: TravelEntry) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadEntries();
            }}
            tintColor={colors.primary}
          />
        }
      />
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => navigation.navigate('AddEntry', { onSuccess: loadEntries })}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </Pressable>
      <FeedbackModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        closeText={modal.closeText}
        backgroundColor={colors.card}
        textColor={colors.text}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
      />
    </View>
  );
};
