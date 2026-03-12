import store from "../store";
import { apiClient, urbApiClient } from "../../config/axiosConfig";
import { matchBetsActions } from "../reducers/matchBets";

const { dispatch } = store;

const sortNewestFirst = (bets: any[] = []) =>
  [...bets].sort((a, b) => {
    const timeA = new Date(a?.placeTime || a?.createdAt || 0).getTime();
    const timeB = new Date(b?.placeTime || b?.createdAt || 0).getTime();
    return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
  });

const mapBetRows = (rawData: any, includeOnlyCompleted = false) => {
  let betList: any[] = [];

  if (Array.isArray(rawData?.Bookmaker)) {
    betList = betList.concat(
      rawData.Bookmaker.map((bet: any) => ({
        name: bet.nation,
        odds: parseFloat(bet.rate || 0),
        stake: Number(bet.amount || 0),
        isBack: !!bet.back,
        isFancy: false,
        marketName: "Bookmaker",
        priceValue: bet.priveValue,
        placeTime: bet.date,
        declared: bet.declared,
        netPnl: Number(bet.netPnl || 0),
      }))
    );
  }

  if (Array.isArray(rawData?.TOSS)) {
    betList = betList.concat(
      rawData.TOSS.map((bet: any) => ({
        name: bet.nation,
        odds: parseFloat(bet.rate || 0),
        stake: Number(bet.amount || 0),
        isBack: !!bet.back,
        isFancy: false,
        marketName: "TOSS",
        priceValue: bet.priveValue,
        placeTime: bet.date,
        declared: bet.declared,
        netPnl: Number(bet.netPnl || 0),
      }))
    );
  }

  if (Array.isArray(rawData?.Fancy2Market)) {
    betList = betList.concat(
      rawData.Fancy2Market.map((bet: any) => ({
        name: bet.nation,
        odds: parseFloat(bet.rate || 0),
        stake: Number(bet.amount || 0),
        isBack: !!bet.back,
        isFancy: true,
        marketName: "Fancy2",
        priceValue: bet.priveValue,
        placeTime: bet.date,
        declared: bet.declared,
        netPnl: Number(bet.netPnl || 0),
      }))
    );
  }

  if (includeOnlyCompleted) {
    betList = betList.filter(
      (bet) => bet.declared && String(bet.declared).trim() !== "" && String(bet.declared).toLowerCase() !== "null"
    );
  }

  return sortNewestFirst(betList);
};

export const fetchBetList = async (matchId: string, activeBet = true) => {
  dispatch(matchBetsActions.fetchBetListStart());

  try {
    const response = await urbApiClient.post("/enduser/bet-list-by-matchid", {
      matchId,
      activeBet,
    });

    if (response?.data?.status) {
      const data = mapBetRows(response?.data?.data || {}, false);
      dispatch(matchBetsActions.fetchBetListSuccess(data));
      return { success: true, data };
    }

    throw new Error(response?.data?.message || "Failed to fetch bet list");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch bet list";
    dispatch(matchBetsActions.fetchBetListFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCompletedBets = async (matchId: string) => {
  dispatch(matchBetsActions.fetchCompletedBetsStart());

  try {
    const response = await urbApiClient.post("/enduser/bet-list-by-matchid", {
      matchId,
      activeBet: false,
    });

    if (response?.data?.status) {
      const data = mapBetRows(response?.data?.data || {}, true);
      dispatch(matchBetsActions.fetchCompletedBetsSuccess(data));
      return { success: true, data };
    }

    throw new Error(response?.data?.message || "Failed to fetch completed bets");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch completed bets";
    dispatch(matchBetsActions.fetchCompletedBetsFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchFancyBook = async (fancyId: string | number, matchId: string) => {
  dispatch(matchBetsActions.fetchFancyBookStart());

  try {
    const response = await apiClient.post("/enduser/fancy-book", {
      fancyId,
      matchId,
    });

    if (response?.data?.status) {
      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      dispatch(matchBetsActions.fetchFancyBookSuccess(data));
      return { success: true, data };
    }

    throw new Error(response?.data?.message || "Failed to fetch fancy book");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch fancy book";
    dispatch(matchBetsActions.fetchFancyBookFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const clearFancyBook = () => {
  dispatch(matchBetsActions.clearFancyBook());
};

export const clearMatchBets = () => {
  dispatch(matchBetsActions.clearMatchBets());
};

export const fetchMatchBetsData = async (matchId: string) => {
  await fetchBetList(matchId, true);
};
