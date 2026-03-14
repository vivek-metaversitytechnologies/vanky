import store from "../store";
import { apiClient } from "../../config/axiosConfig";
import { gameActions } from "../reducers/game";

const { dispatch } = store;

export const fetchGameData = async (matchId: string, silent = false) => {
  if (!silent) {
    dispatch(gameActions.requestStart());
  }

  try {
    const response = await apiClient.get(`/betfair_api/fancy/sap/${matchId}`);

    const gameData = {
      odds: response?.data?.Odds || [],
      bookmaker: response?.data?.Bookmaker || [],
      fancy: response?.data?.Fancy || [],
      fancy2: response?.data?.Fancy2 || [],
    };

    if (silent) {
      dispatch(gameActions.updateGameData(gameData));
    } else {
      dispatch(gameActions.loadGameData(gameData));
    }

    return { success: true, data: gameData };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch game data";

    dispatch(gameActions.requestFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const clearGameData = () => {
  dispatch(gameActions.clearGameData());
};
