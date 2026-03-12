import { createSlice } from "@reduxjs/toolkit";
import { authInitialState } from '../initialState';

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadUser(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logOut(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
    resetAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
    requestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
