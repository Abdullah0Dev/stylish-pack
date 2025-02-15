import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';  // TabNavigator will manage your tabs
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* TabNavigator is the root of the main app flow */}
      <Stack.Screen name="Tabs" component={TabNavigator} />
      {/* SettingsScreen is a normal stack screen */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
