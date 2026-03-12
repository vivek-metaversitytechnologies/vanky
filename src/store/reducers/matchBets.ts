import { createSlice } from "@reduxjs/toolkit";
import { matchBetsInitialState } from "../initialState";

const matchBetsSlice = createSlice({
  name: "matchBets",
  initialState: matchBetsInitialState,
  reducers: {
    fetchBetListStart(state) {
      state.loadingBetList = true;
      state.errorBetList = null;
    },
    fetchBetListSuccess(state, action) {
      state.betList = Array.isArray(action.payload) ? action.payload : [];
      state.loadingBetList = false;
      state.errorBetList = null;
    },
    fetchBetListFail(state, action) {
      state.loadingBetList = false;
      state.errorBetList = action.payload || "Failed to fetch bet list";
    },

    fetchCompletedBetsStart(state) {
      state.loadingCompletedBets = true;
      state.errorCompletedBets = null;
    },
    fetchCompletedBetsSuccess(state, action) {
      state.completedBets = Array.isArray(action.payload) ? action.payload : [];
      state.loadingCompletedBets = false;
      state.errorCompletedBets = null;
    },
    fetchCompletedBetsFail(state, action) {
      state.loadingCompletedBets = false;
      state.errorCompletedBets = action.payload || "Failed to fetch completed bets";
    },

    fetchFancyBookStart(state) {
      state.loadingFancyBook = true;
      state.errorFancyBook = null;
    },
    fetchFancyBookSuccess(state, action) {
      state.fancyBook = Array.isArray(action.payload) ? action.payload : [];
      state.loadingFancyBook = false;
      state.errorFancyBook = null;
    },
    fetchFancyBookFail(state, action) {
      state.loadingFancyBook = false;
      state.errorFancyBook = action.payload || "Failed to fetch fancy book";
    },

    clearFancyBook(state) {
      state.fancyBook = [];
      state.loadingFancyBook = false;
      state.errorFancyBook = null;
    },

    clearMatchBets(state) {
      state.betList = [];
      state.completedBets = [];
      state.fancyBook = [];
      state.loadingBetList = false;
      state.loadingCompletedBets = false;
      state.loadingFancyBook = false;
      state.errorBetList = null;
      state.errorCompletedBets = null;
      state.errorFancyBook = null;
    },
  },
});

export const matchBetsActions = matchBetsSlice.actions;
export default matchBetsSlice.reducer;
