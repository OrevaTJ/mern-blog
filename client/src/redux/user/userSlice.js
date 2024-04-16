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

    // clear error
    clearError: (state) => {
      state.error = null;
    },

    // update reducers
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },
    updateUserFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },

    // delete reducers
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    deleteUserFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },

    // signout reducers
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    signOutUserFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  signInStart,
  signInSuccess,
  signInError,
  clearError,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
