import { createSlice } from "@reduxjs/toolkit";
import { betInitialState } from "../initialState";

const betSlice = createSlice({
  name: "bet",
  initialState: betInitialState,
  reducers: {
    placeBetStart(state) {
      state.placingBet = true;
      state.betSuccess = false;
      state.betError = null;
    },
    placeBetSuccess(state, action) {
      state.placingBet = false;
      state.betSuccess = true;
      state.betError = null;
      state.lastBetResponse = action.payload;
    },
    placeBetFail(state, action) {
      state.placingBet = false;
      state.betSuccess = false;
      state.betError = action.payload;
    },
    resetBetState(state) {
      state.placingBet = false;
      state.betSuccess = false;
      state.betError = null;
      state.lastBetResponse = null;
    },
  },
});

export const betActions = betSlice.actions;
export default betSlice.reducer;
