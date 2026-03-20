export type FeedbackModalType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackModalState {
  visible: boolean;
  title: string;
  message: string;
  type: FeedbackModalType;
  onConfirm?: () => void;
  confirmText?: string;
  closeText?: string;
}

export const createDefaultModalState = (): FeedbackModalState => ({
  visible: false,
  title: '',
  message: '',
  type: 'info',
});
