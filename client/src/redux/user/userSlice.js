import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
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
    signInFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    updateStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    updateSuccess: (state, action) => {
      (state.loading = false),
        (state.error = null),
        (state.currentUser = action.payload);
    },
    updateFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    deleteUserStart: (state, action) => {
      (state.error = null), (state.loading = true);
    },
    deleteUserSuccess: (state, action) => {
      (state.error = null), (state.currentUser = null), (state.loading = false);
    },
    deleteUserFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    signOutSuccess: (state) => {
      (state.error = null), (state.currentUser = null), (state.loading = false);
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
