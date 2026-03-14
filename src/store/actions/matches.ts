import store from "../store";
import { apiClient } from "../../config/axiosConfig";
import { matchesActions } from "../reducers/matches";

const { dispatch } = store;

export const fetchMatches = async () => {
  dispatch(matchesActions.requestStart());

  try {
    const response = await apiClient.get("/betfair_api/active_match/v5/4");
    const list = response?.data?.data || [];

    dispatch(matchesActions.requestSuccess(list));
    return { success: true, data: list };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Unable to fetch match list";

    dispatch(matchesActions.requestFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};
