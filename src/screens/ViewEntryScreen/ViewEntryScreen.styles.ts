import { StyleSheet } from 'react-native';

export const ViewEntryScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
  thumbnailList: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnailButton: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
    gap: 14,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  detailCard: {
    flex: 1,
    minHeight: 75,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'flex-start',
  },
  fullWidthCard: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  coordinateValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  buttonFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  deleteButton: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
