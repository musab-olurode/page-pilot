import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  show: false,
  message: '',
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar(state, action: PayloadAction<{message: string}>) {
      const {message} = action.payload;
      return {
        show: true,
        message,
      };
    },

    hideSnackbar() {
      return {
        show: false,
        message: '',
      };
    },
  },
});

export const {showSnackbar, hideSnackbar} = snackbarSlice.actions;

export default snackbarSlice.reducer;
