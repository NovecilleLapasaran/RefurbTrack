import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';
import { House, Smartphone, History, UserRound } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Comfortaa_600SemiBold, Comfortaa_700Bold } from '@expo-google-fonts/comfortaa';
import { View } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { WelcomeScreen } from './src/welcome';
import { WorkshopBar } from './src/navigation';
import { StoreProvider, useStore } from './src/store';
import { Loading, Page } from './src/ui';
import { ThemeProvider, useTheme } from './src/theme';
import { ConfirmationHost } from './components/ui/dialog';
import { HomeScreen } from './src/workshop';
import { AccountScreen, DetailScreen, ExpenseScreen, IntakeScreen, LoginScreen, ProgressScreen, SaleScreen } from './src/screens';
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const icons = { Workshop: House, Records: Smartphone, History, Account: UserRound };
function WorkshopTabs() {
  const { C } = useTheme();
  return <Tabs.Navigator tabBar={props => <WorkshopBar {...props} />} screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: C.teal, tabBarInactiveTintColor: C.muted,
    tabBarHideOnKeyboard: true, tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.divider, elevation: 0 },
    tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }, tabBarItemStyle: { paddingVertical: 4 },
    tabBarIcon: ({ color }) => { const Icon = icons[route.name]; return <Icon color={color} size={23} strokeWidth={1.8} />; } })}>
    <Tabs.Screen name="Workshop" component={HomeScreen} /><Tabs.Screen name="Records" component={HomeScreen} />
    <Tabs.Screen name="History" component={HomeScreen} /><Tabs.Screen name="Account" component={AccountScreen} />
  </Tabs.Navigator>;
}
function Routes() {
  const { C, dark } = useTheme();
  const base = dark ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, primary: C.teal, background: C.paper, card: C.surface, text: C.ink, border: C.divider } };
  const { user, practice, authLoading } = useStore();
  return <NavigationContainer theme={theme}>
    <Stack.Navigator screenOptions={{ headerTintColor: C.navy, headerShadowVisible: false, headerStyle: { backgroundColor: C.paper }, headerTitleStyle: { fontWeight: '600', fontSize: 16 }, contentStyle: { backgroundColor: C.paper } }}>
      {authLoading ? <Stack.Screen name="Loading" options={{ headerShown: false }}>{() => <Page top><Loading message="Opening your shop…" /></Page>}</Stack.Screen> : !user && !practice ? <Stack.Group>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Your account' }} />
      </Stack.Group> : <Stack.Group navigationKey={practice ? 'practice' : user.uid}>
        <Stack.Screen name="Home" component={WorkshopTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Phone record' }} />
        <Stack.Screen name="Intake" component={IntakeScreen} options={{ title: 'Intake' }} />
        <Stack.Screen name="Expense" component={ExpenseScreen} options={{ title: 'Expense' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
        <Stack.Screen name="Sale" component={SaleScreen} options={{ title: 'Final payment' }} />
      </Stack.Group>}
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>;
}
function AppContent() {
  const { C, dark } = useTheme();
  const [fontsLoaded, fontError] = useFonts({ Comfortaa_600SemiBold, Comfortaa_700Bold });
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);
  const transition = useAnimatedStyle(() => ({ opacity: opacity.value }));
  useEffect(() => {
    opacity.value = reducedMotion ? 1 : 0.65;
    opacity.value = withTiming(1, { duration: 280, reduceMotion: ReduceMotion.System });
  }, [dark, reducedMotion, opacity]);
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: C.paper }}><Loading message={null} /></View>;
  return <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.paper }}><Animated.View style={[{ flex: 1 }, transition]}><SafeAreaProvider><StoreProvider><BottomSheetModalProvider>
    <StatusBar style={dark ? 'light' : 'dark'} /><Routes /><ConfirmationHost /><PortalHost />
  </BottomSheetModalProvider></StoreProvider></SafeAreaProvider></Animated.View></GestureHandlerRootView>;
}
