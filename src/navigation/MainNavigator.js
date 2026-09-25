import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import PhonesScreen from '../screens/PhonesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AddPhoneScreen from '../screens/AddPhoneScreen';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcon = (name) => ({ color, size }) => (
  <MaterialCommunityIcons name={name} color={color} size={size} />
);

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textMuted,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen
      name="Home"
      component={DashboardScreen}
      options={{ tabBarIcon: tabIcon('view-grid-outline') }}
    />
    <Tab.Screen
      name="Units"
      component={PhonesScreen}
      options={{ tabBarIcon: tabIcon('clipboard-text-outline') }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{ tabBarIcon: tabIcon('history') }}
    />
  </Tab.Navigator>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.background,
    card: theme.surface,
    text: theme.text,
    primary: theme.primary,
    border: theme.border,
  },
};

const MainNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="AddPhone"
        component={AddPhoneScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.surface,
    borderTopColor: theme.border,
    borderTopWidth: 1,
    height: 66,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MainNavigator;
