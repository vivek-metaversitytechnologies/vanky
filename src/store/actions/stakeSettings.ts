import store from "../store";
import { toast } from "react-toastify";
import { apiClient } from "../../config/axiosConfig";
import { stakeSettingsActions } from "../reducers/stakeSettings";

const DEFAULT_STAKE_VALUES = [
  100, 500, 1000, 2000, 5000, 10000,
  25000, 50000, 100000, 200000, 300000, 500000,
];

const { dispatch, getState } = store;

const mapApiDataToValues = (data: any) => [
  Number(data?.stack1 || 100),
  Number(data?.stack2 || 500),
  Number(data?.stack3 || 1000),
  Number(data?.stack4 || 2000),
  Number(data?.stack5 || 5000),
  Number(data?.stack6 || 10000),
  Number(data?.stack7 || 25000),
  Number(data?.stack8 || 50000),
  Number(data?.stack9 || 100000),
  Number(data?.stack10 || 200000),
  Number(data?.stack11 || 300000),
  Number(data?.stack12 || 500000),
];

const mapValuesToPayload = (values: number[]) => ({
  stack1: values[0],
  stack2: values[1],
  stack3: values[2],
  stack4: values[3],
  stack5: values[4],
  stack6: values[5],
  stack7: values[6],
  stack8: values[7],
  stack9: values[8],
  stack10: values[9],
  stack11: values[10],
  stack12: values[11],
});

export const setStakeSettingsValues = (values: number[]) => {
  dispatch(stakeSettingsActions.setStakeSettingsValues(values));
};

export const clearStakeSettingsMessage = () => {
  dispatch(stakeSettingsActions.clearStakeSettingsMessage());
};

export const fetchStakeSettings = async () => {
  dispatch(stakeSettingsActions.fetchStakeSettingsStart());

  try {
    const state = getState() as { auth?: { user?: { userId?: string } } };
    const userId = state?.auth?.user?.userId;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await apiClient.post("/enduser/get-stake-button", { userId });
    const result = response?.data;

    if (response.status >= 200 && response.status < 300 && result?.status && result?.data) {
      const values = mapApiDataToValues(result.data);
      dispatch(stakeSettingsActions.fetchStakeSettingsSuccess(values));
      return { success: true, values };
    }

    throw new Error(result?.message || "Failed to fetch stake values");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.message ||
      "An error occurred while fetching stake values";

    dispatch(stakeSettingsActions.fetchStakeSettingsFail(errorMessage));
    return { success: false, error: errorMessage, values: DEFAULT_STAKE_VALUES };
  }
};

export const saveStakeSettings = async (values: number[]) => {
  dispatch(stakeSettingsActions.saveStakeSettingsStart());

  try {
    const isValid = values.length === 12 && values.every((value) => Number(value) > 0);
    if (!isValid) {
      throw new Error("All stake values must be greater than 0");
    }

    const payload = mapValuesToPayload(values);
    const response = await apiClient.post("/enduser/set-stake-button", payload);
    const result = response?.data;

    if (response.status >= 200 && response.status < 300 && result?.status) {
      const message = result?.message || "Stake values saved successfully!";
      dispatch(stakeSettingsActions.saveStakeSettingsSuccess({ message, values }));
      toast.success(message);
      return { success: true, message };
    }

    throw new Error(result?.message || "Failed to save stake values");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.message ||
      "An error occurred while saving stake values";

    dispatch(stakeSettingsActions.saveStakeSettingsFail(errorMessage));
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export { DEFAULT_STAKE_VALUES };
