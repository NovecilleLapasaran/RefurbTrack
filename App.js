import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { theme } from './src/theme/theme';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
};

export default App;
