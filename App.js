import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
