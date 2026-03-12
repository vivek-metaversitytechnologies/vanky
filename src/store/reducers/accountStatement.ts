import { createSlice } from "@reduxjs/toolkit";
import { accountStatementInitialState } from "../initialState";

const accountStatementSlice = createSlice({
  name: "accountStatement",
  initialState: accountStatementInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.rows = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    requestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.rows = [];
    },
  },
});

export default accountStatementSlice.reducer;
export const accountStatementActions = accountStatementSlice.actions;