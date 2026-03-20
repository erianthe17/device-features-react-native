import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  HomeStack: undefined;
  AddEntryStack: undefined;
};

export type RootStackParamList = {
  HomeList: undefined;
  AddEntry: { onSuccess?: () => void };
  ViewEntry: { entryId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeList'>;
export type TravelEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'AddEntry'>;
export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;
