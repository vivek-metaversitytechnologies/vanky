import { createSlice } from "@reduxjs/toolkit";
import { stakeSettingsInitialState } from "../initialState";

const stakeSettingsSlice = createSlice({
  name: "stakeSettings",
  initialState: stakeSettingsInitialState,
  reducers: {
    fetchStakeSettingsStart(state) {
      state.loading = true;
      state.saving = false;
      state.error = null;
      state.message = null;
    },
    fetchStakeSettingsSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.values = action.payload || state.values;
    },
    fetchStakeSettingsFail(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch stake settings";
    },
    saveStakeSettingsStart(state) {
      state.saving = true;
      state.error = null;
      state.message = null;
    },
    saveStakeSettingsSuccess(state, action) {
      state.saving = false;
      state.error = null;
      state.message = action.payload?.message || "Stake values saved successfully";
      if (action.payload?.values) {
        state.values = action.payload.values;
      }
    },
    saveStakeSettingsFail(state, action) {
      state.saving = false;
      state.error = action.payload || "Failed to save stake settings";
    },
    setStakeSettingsValues(state, action) {
      state.values = action.payload || state.values;
    },
    clearStakeSettingsMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
});

export const stakeSettingsActions = stakeSettingsSlice.actions;
export default stakeSettingsSlice.reducer;
