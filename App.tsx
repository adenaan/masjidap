import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Navigation } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.ink}
      />
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
