import { createSlice } from "@reduxjs/toolkit";
import { messageInitialState } from "../initialState";

const messageSlice = createSlice({
  name: "message",
  initialState: messageInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
      state.text = "";
    },
    requestSuccess(state, action) {
      state.text = String(action.payload || "").trim();
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    requestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.text = "";
    },
  },
});

export default messageSlice.reducer;
export const messageActions = messageSlice.actions;
