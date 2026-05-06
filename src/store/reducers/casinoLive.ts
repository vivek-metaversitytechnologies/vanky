import { createSlice } from "@reduxjs/toolkit";
import { casinoLiveInitialState } from "../initialState";

const casinoLiveSlice = createSlice({
  name: "casinoLive",
  initialState: casinoLiveInitialState,
  reducers: {
    fetchCasinoListStart(state) {
      state.loadingCasinoList = true;
      state.errorCasinoList = null;
    },
    fetchCasinoListSuccess(state, action) {
      state.casinoList = Array.isArray(action.payload) ? action.payload : [];
      state.loadingCasinoList = false;
      state.errorCasinoList = null;
      state.lastCasinoListFetched = Date.now();
    },
    fetchCasinoListFail(state, action) {
      state.loadingCasinoList = false;
      state.errorCasinoList = action.payload || "Failed to fetch casino list";
    },

    fetchCasinoMetaStart(state) {
      state.loadingMeta = true;
      state.errorMeta = null;
    },
    fetchCasinoMetaSuccess(state, action) {
      state.meta = action.payload?.meta || [];
      state.runners = action.payload?.runners || [];
      state.extra = action.payload?.extra || [];
      state.roundId = action.payload?.roundId || null;
      state.gameType = action.payload?.gameType || null;
      state.loadingMeta = false;
      state.errorMeta = null;
      state.lastMetaFetched = Date.now();
    },
    fetchCasinoMetaFail(state, action) {
      state.loadingMeta = false;
      state.errorMeta = action.payload || "Failed to fetch casino odds";
    },

    fetchLiabilityStart(state) {
      state.loadingLiability = true;
      state.errorLiability = null;
    },
    fetchLiabilitySuccess(state, action) {
      state.liability = Array.isArray(action.payload) ? action.payload : [];
      state.loadingLiability = false;
      state.errorLiability = null;
      state.lastLiabilityFetched = Date.now();
    },
    fetchLiabilityFail(state, action) {
      state.loadingLiability = false;
      state.errorLiability = action.payload || "Failed to fetch liability";
    },

    fetchCasinoUserBetsStart(state) {
      state.loadingUserBets = true;
      state.errorUserBets = null;
    },
    fetchCasinoUserBetsSuccess(state, action) {
      state.userBets = Array.isArray(action.payload) ? action.payload : [];
      state.loadingUserBets = false;
      state.errorUserBets = null;
      state.lastUserBetsFetched = Date.now();
    },
    fetchCasinoUserBetsFail(state, action) {
      state.loadingUserBets = false;
      state.errorUserBets = action.payload || "Failed to fetch user bets";
    },

    fetchCasinoResultStart(state) {
      state.loadingResult = true;
      state.errorResult = null;
    },
    fetchCasinoResultSuccess(state, action) {
      state.lastResult = action.payload || null;
      state.loadingResult = false;
      state.errorResult = null;
      state.lastResultFetched = Date.now();
    },
    fetchCasinoResultFail(state, action) {
      state.loadingResult = false;
      state.errorResult = action.payload || "Failed to fetch result";
    },

    fetchCasinoLastResultsStart(state) {
      state.loadingLastResults = true;
      state.errorLastResults = null;
    },
    fetchCasinoLastResultsSuccess(state, action) {
      state.lastResults = Array.isArray(action.payload) ? action.payload : [];
      state.loadingLastResults = false;
      state.errorLastResults = null;
      state.lastResultsFetched = Date.now();
    },
    fetchCasinoLastResultsFail(state, action) {
      state.loadingLastResults = false;
      state.errorLastResults = action.payload || "Failed to fetch last results";
    },

    placeCasinoBetStart(state) {
      state.placingBet = true;
      state.placeBetError = null;
      state.placeBetSuccess = null;
    },
    placeCasinoBetSuccess(state, action) {
      state.placingBet = false;
      state.placeBetError = null;
      state.placeBetSuccess = action.payload || "Bet placed";
    },
    placeCasinoBetFail(state, action) {
      state.placingBet = false;
      state.placeBetError = action.payload || "Failed to place bet";
    },

    clearCasinoLiveState(state) {
      state.meta = [];
      state.runners = [];
      state.extra = [];
      state.roundId = null;
      state.gameType = null;
      state.liability = [];
      state.userBets = [];
      state.lastResult = null;
      state.lastResults = [];
      state.loadingMeta = false;
      state.errorMeta = null;
      state.loadingLiability = false;
      state.errorLiability = null;
      state.loadingUserBets = false;
      state.errorUserBets = null;
      state.loadingResult = false;
      state.errorResult = null;
      state.loadingLastResults = false;
      state.errorLastResults = null;
      state.placingBet = false;
      state.placeBetError = null;
      state.placeBetSuccess = null;
    },
  },
});

export const casinoLiveActions = casinoLiveSlice.actions;
export default casinoLiveSlice.reducer;
