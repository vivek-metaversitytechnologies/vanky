import { createSlice } from "@reduxjs/toolkit";
import { passwordChangeInitialState } from "../initialState";

const passwordChangeSlice = createSlice({
  name: "passwordChange",
  initialState: passwordChangeInitialState,
  reducers: {
    changePasswordStart(state) {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.message = null;
    },
    changePasswordSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.message = action.payload?.message || "Password changed successfully";
    },
    changePasswordFail(state, action) {
      state.loading = false;
      state.success = false;
      state.error = action.payload || "Failed to change password";
      state.message = null;
    },
    resetPasswordChange() {
      return passwordChangeInitialState;
    },
  },
});

export const passwordChangeActions = passwordChangeSlice.actions;
export default passwordChangeSlice.reducer;
