import { StyleSheet } from 'react-native';

export const ViewEntryScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  coordinatesGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  coordinateItem: {
    flex: 1,
    paddingVertical: 12,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
