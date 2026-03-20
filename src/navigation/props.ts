import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeList:
    | {
        feedback?: {
          title: string;
          message: string;
          type: 'success' | 'error' | 'warning' | 'info';
        };
      }
    | undefined;
  AddEntry: { onSuccess?: () => void };
  ViewEntry: { entryId: string };
};

export type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type HomeScreenProps = Props<'HomeList'>;
export type TravelEntryScreenProps = Props<'AddEntry'>;
export type ViewEntryScreenProps = Props<'ViewEntry'>;
