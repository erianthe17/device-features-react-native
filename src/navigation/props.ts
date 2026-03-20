import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  HomeStack: undefined;
  AddEntryStack: undefined;
};

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
export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

export type HomeScreenProps = Props<'HomeList'>;
export type TravelEntryScreenProps = Props<'AddEntry'>;
export type ViewEntryScreenProps = Props<'ViewEntry'>;
