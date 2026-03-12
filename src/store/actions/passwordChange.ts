import store from "../store";
import { toast } from "react-toastify";
import { urbApiClient } from "../../config/axiosConfig";
import { passwordChangeActions } from "../reducers/passwordChange";

const { dispatch, getState } = store;

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  dispatch(passwordChangeActions.changePasswordStart());

  try {
    const state = getState() as { auth?: { accessToken?: string | null } };
    const token = state?.auth?.accessToken;

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      throw new Error("Please fill in all fields");
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    const response = await urbApiClient.post("/user/changepassword-self", payload);

    if (response.data?.status) {
      const message = response.data?.message || "Password changed successfully!";
      dispatch(passwordChangeActions.changePasswordSuccess({ message }));
      toast.success(message);
      return { success: true, message };
    }

    throw new Error(response.data?.message || "Failed to change password");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.message ||
      "Failed to change password";

    dispatch(passwordChangeActions.changePasswordFail(errorMessage));
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const resetPasswordChange = () => {
  dispatch(passwordChangeActions.resetPasswordChange());
};
