import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TravelEntry } from '../../types';
import { TravelEntryCardStyles as styles } from './TravelEntryCard.styles';

interface TravelEntryCardProps {
  entry: TravelEntry;
  onDelete: (entryId: string) => void;
  onPress?: (entryId: string) => void;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  secondaryColor: string;
}

export const TravelEntryCard: React.FC<TravelEntryCardProps> = ({
  entry,
  onDelete,
  onPress,
  backgroundColor,
  borderColor,
  textColor,
  secondaryColor,
}) => {
  const coverImage = entry.imageUris[0] || entry.imageUri;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => onPress?.(entry.id)}
    >
      <View style={styles.imageWrapper}>
        {coverImage ? <Image source={{ uri: coverImage }} style={styles.image} /> : null}
        {entry.imageUris.length > 1 ? (
          <View style={styles.imageCountBadge}>
            <MaterialIcons name="photo-library" size={14} color="#FFFFFF" />
            <Text style={styles.imageCountText}>{entry.imageUris.length}</Text>
          </View>
        ) : null}
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: secondaryColor, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => onDelete(entry.id)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={[styles.addressText, { color: textColor }]} numberOfLines={2}>
          {entry.address}
        </Text>
        <Text style={[styles.coordinatesText, { color: textColor }]}>
          Coordinates: {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
        </Text>
        <Text style={[styles.dateText, { color: textColor }]}>
          Date Added: {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </Pressable>
  );
};
