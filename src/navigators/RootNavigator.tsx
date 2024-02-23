import React from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ZLibraryBookResult} from '../types/books';
import BookDetails from '../screens/BookDetails';
import {Snackbar, useTheme} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {hideSnackbar} from '../redux/snackbar/snackbarSlice';
import CustomWebView from '../screens/CustomWebView';
import HomeTabsNavigator from './HomeNavigator';
import Services from '../screens/Services';

export type RootNavigatorParamList = {
  HomeTabs: undefined;
  BookDetails: {book: ZLibraryBookResult};
  CustomWebView: {url: string; title: string};
  Services: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const snackbar = useAppSelector(state => state.snackbar);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabsNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookDetails"
          component={BookDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomWebView"
          component={CustomWebView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Services"
          component={Services}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <Snackbar
        duration={3000}
        visible={snackbar.show}
        onDismiss={() => dispatch(hideSnackbar())}>
        {snackbar.message}
      </Snackbar>
    </>
  );
};

export default RootNavigator;
