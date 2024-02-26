import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      (state.error = null), (state.loading = true);
    },
    signInSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.error = null),
        (state.loading = false);
    },
    signInError: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
  },
});

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInError } = userSlice.actions;

export default userSlice.reducer;
