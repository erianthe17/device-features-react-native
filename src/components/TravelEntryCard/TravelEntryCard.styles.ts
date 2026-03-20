import { StyleSheet } from 'react-native';

export const TravelEntryCardStyles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
