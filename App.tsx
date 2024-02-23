import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import RootNavigator from './src/navigators/RootNavigator';
import {Provider as ReduxProvider} from 'react-redux';
import {reduxStore} from './src/redux/store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Material3ThemeProvider} from './src/providers/Material3ThemeProvider';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <Material3ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaView className="flex-1">
              <RootNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </QueryClientProvider>
      </Material3ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
