import { createSlice } from "@reduxjs/toolkit";
import { balanceInitialState } from "../initialState";

const balanceSlice = createSlice({
  name: "balance",
  initialState: balanceInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      const next = action.payload || {};
      state.balance = Number(next.balance || 0);
      state.liability = Number(next.liability || 0);
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

export default balanceSlice.reducer;
export const balanceActions = balanceSlice.actions;
