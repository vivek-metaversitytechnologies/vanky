import { createSlice } from "@reduxjs/toolkit";
import { matchesInitialState } from "../initialState";

const matchesSlice = createSlice({
  name: "matches",
  initialState: matchesInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    requestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default matchesSlice.reducer;
export const matchesActions = matchesSlice.actions;
