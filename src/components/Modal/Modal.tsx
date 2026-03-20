import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

interface ModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  closeText?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const FeedbackModal: React.FC<ModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  closeText = 'Cancel',
  type = 'info',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  primaryColor = '#007AFF',
  secondaryColor = '#E5E5EA',
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return '#34C759';
      case 'error':
        return '#FF3B30';
      case 'warning':
        return '#FF9500';
      case 'info':
      default:
        return primaryColor;
    }
  };

  const typeColor = getTypeColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor }]}>
          <View style={[styles.headerBar, { backgroundColor: typeColor }]} />
          
          <Text style={[styles.title, { color: textColor }]}>
            {title}
          </Text>
          
          <Text style={[styles.message, { color: textColor }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {onConfirm ? (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: secondaryColor, opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: textColor }]}>
                    {closeText}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: typeColor, opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() => {
                    onConfirm();
                    onClose?.();
                  }}
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                    {confirmText}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: typeColor, opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  {confirmText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 12,
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minWidth: '80%',
    maxWidth: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerBar: {
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: -20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

