import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { ModalStyles as styles } from './Modal.styles';

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
  closeText,
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
          
          <Text style={[styles.title, { color: textColor }]}>
            {title}
          </Text>
          
          <Text style={[styles.message, { color: textColor }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {onConfirm && closeText ? (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: secondaryColor, opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                    {closeText}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: typeColor, opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={onConfirm}
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
                onPress={onConfirm || onClose}
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
