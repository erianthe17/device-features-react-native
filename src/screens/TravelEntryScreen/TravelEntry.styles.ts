import { StyleSheet } from 'react-native';

export const TravelEntryScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
  cameraContainer: {
    flex: 1,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    height: 400,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
  },
  thumbnailList: {
    gap: 10,
    paddingBottom: 12,
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
  changeImageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  imageActionsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  saveContainer: {
    gap: 12,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
});
