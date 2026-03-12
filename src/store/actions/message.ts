import store from "../store";
import { urbApiClient } from "../../config/axiosConfig";
import { messageActions } from "../reducers/message";

const { dispatch } = store;

export const fetchMessage = async () => {
  dispatch(messageActions.requestStart());

  try {
    const response = await urbApiClient.post("/message/get-message", {});
    const text = response?.data?.data || "";

    dispatch(messageActions.requestSuccess(text));
    return { success: true, data: text };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Unable to fetch message";

    dispatch(messageActions.requestFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};
