import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './loading/loadingSlice';
import snackbarReducer from './snackbar/snackbarSlice';

export const reduxStore = configureStore({
  reducer: {
    loading: loadingReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;
