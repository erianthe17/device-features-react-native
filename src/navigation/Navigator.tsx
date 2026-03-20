import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { TravelEntryScreen } from '../screens/TravelEntryScreen/TravelEntryScreen';
import { ViewEntryScreen } from '../screens/ViewEntryScreen/ViewEntryScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{
          headerTitle: 'Travel Diary',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddEntry"
        component={TravelEntryScreen}
        options={{
          headerTitle: 'Add Travel Entry',
          headerShown: true,
          headerBackButtonMenuEnabled: false,
        }}
      />
      <Stack.Screen
        name="ViewEntry"
        component={ViewEntryScreen}
        options={{
          headerTitle: 'Travel Entry',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
