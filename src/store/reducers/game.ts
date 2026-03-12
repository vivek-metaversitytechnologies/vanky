import { createSlice } from "@reduxjs/toolkit";
import { gameInitialState } from "../initialState";

const gameSlice = createSlice({
  name: "game",
  initialState: gameInitialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadGameData(state, action) {
      state.odds = action.payload?.odds || [];
      state.bookmaker = action.payload?.bookmaker || [];
      state.fancy = action.payload?.fancy || [];
      state.fancy2 = action.payload?.fancy2 || [];
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    updateGameData(state, action) {
      state.odds = action.payload?.odds || [];
      state.bookmaker = action.payload?.bookmaker || [];
      state.fancy = action.payload?.fancy || [];
      state.fancy2 = action.payload?.fancy2 || [];
      state.lastFetched = Date.now();
    },
    requestFail(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch game data";
    },
    clearGameData(state) {
      state.odds = [];
      state.bookmaker = [];
      state.fancy = [];
      state.fancy2 = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
