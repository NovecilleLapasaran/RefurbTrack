import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider, useStore } from './src/store';
import { C, Loading, Page } from './src/ui';
import { AccountScreen, DetailScreen, ExpenseScreen, HomeScreen, IntakeScreen, LoginScreen, ProgressScreen, SaleScreen } from './src/screens';

const Stack = createNativeStackNavigator();
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: C.teal, background: C.paper, card: C.white, text: C.ink, border: C.line } };
function Routes() {
  const { user, practice, authLoading } = useStore();
  if (authLoading) return <Page title="RefurbTrack"><Loading message="Restoring your session…" /></Page>;
  return <NavigationContainer theme={theme}>
    <Stack.Navigator screenOptions={{ headerTintColor: C.navy, headerShadowVisible: false, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: C.paper } }}>
      {!user && !practice ? <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome' }} /> : <Stack.Group navigationKey={practice ? 'practice' : user.uid}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Workshop' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Phone record' }} />
        <Stack.Screen name="Intake" component={IntakeScreen} options={{ title: 'Intake' }} />
        <Stack.Screen name="Expense" component={ExpenseScreen} options={{ title: 'Expense' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
        <Stack.Screen name="Sale" component={SaleScreen} options={{ title: 'Final payment' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
      </Stack.Group>}
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><StoreProvider><StatusBar style="dark" /><Routes /></StoreProvider></SafeAreaProvider>;
}
