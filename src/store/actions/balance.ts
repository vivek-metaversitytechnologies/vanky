import store from "../store";
import { urbApiClient } from "../../config/axiosConfig";
import { balanceActions } from "../reducers/balance";

const { dispatch } = store;

export const fetchBalance = async () => {
  dispatch(balanceActions.requestStart());

  try {
    const response = await urbApiClient.post("/enduser/get-balance", {});
    const data = response?.data?.data || { balance: 0, liability: 0 };

    dispatch(balanceActions.requestSuccess(data));
    return { success: true, data };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Unable to fetch balance";

    dispatch(balanceActions.requestFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};
