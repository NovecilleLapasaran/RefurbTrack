import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { AppProvider } from './src/context/AppContext';
import { paperTheme } from './src/theme/theme';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AppProvider>
          <StatusBar style="dark" />
          <MainNavigator />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
