import { toast } from "react-toastify";
import store from "../store";
import { casinoApiClient, urbApiClient } from "../../config/axiosConfig";
import { casinoLiveActions } from "../reducers/casinoLive";

const { dispatch } = store;

const toNumber = (val: any) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

const normalizeRunner = (item: any) => ({
  mid: String(item?.mid || ""),
  sid: String(item?.sid || item?.sectionId || item?.Srno || ""),
  name: String(item?.nation || item?.nat || ""),
  rate: toNumber(item?.rate),
  backOdds: toNumber(item?.b1 || item?.rate),
  layOdds: toNumber(item?.l1),
  gstatus: String(item?.gstatus || ""),
  min: toNumber(item?.min),
  max: toNumber(item?.max),
  raw: item,
});

const normalizeCasinoBets = (rows: any[] = []) =>
  rows.map((row) => ({
    id: row?.id,
    gameName: row?.gameName || "",
    roundId: row?.roundId || "",
    stake: toNumber(row?.stake),
    odds: toNumber(row?.odds),
    pnl: toNumber(row?.pnl),
    date: row?.date || "",
    selectionName: row?.selectionName || "",
    back: !!row?.back,
  }));

const normalizeResultRows = (rows: any[] = []) =>
  rows.map((row) => ({
    mid: String(row?.mid || ""),
    result: String(row?.result || ""),
  }));

const getDeviceInfo = () => ({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  browser: "Chrome",
  device: "Macintosh",
  deviceType: "desktop",
  os: "Windows",
  os_version: "windows-10",
  browser_version: "108.0.0.0",
  orientation: "landscape",
});

const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const fetchCasinoList = async (silent = false) => {
  if (!silent) dispatch(casinoLiveActions.fetchCasinoListStart());

  try {
    const response = await urbApiClient.post("/casino/casino-list", {});
    const data = Array.isArray(response?.data?.data) ? response.data.data : [];

    dispatch(casinoLiveActions.fetchCasinoListSuccess(data));
    return { success: true, data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch casino list";
    dispatch(casinoLiveActions.fetchCasinoListFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCasinoMeta = async (metaPath: string, silent = false) => {
  if (!silent) dispatch(casinoLiveActions.fetchCasinoMetaStart());

  try {
    let response;

    try {
      response = await casinoApiClient.get(metaPath);
    } catch (_error) {
      const alternatePath = metaPath.includes("/data/")
        ? metaPath.replace("/data/", "/result/")
        : metaPath.includes("/result/")
        ? metaPath.replace("/result/", "/data/")
        : "";

      if (!alternatePath) throw _error;
      response = await casinoApiClient.get(alternatePath);
    }

    const t1 = Array.isArray(response?.data?.t1) ? response.data.t1 : [];
    const t2 = Array.isArray(response?.data?.t2) ? response.data.t2 : [];
    const t3 = Array.isArray(response?.data?.t3) ? response.data.t3 : [];

    const meta = t1;

    // Some games return odds rows in t2, while others (like Teen) embed rows in t1.
    const rawRunnerRows = t2.length > 0 ? t2 : t1;
    const runners = rawRunnerRows
      .map(normalizeRunner)
      .filter((row: any) => row?.name || row?.sid);

    const roundId = String(t1?.[0]?.mid || t1?.[0]?.marketId || "");
    const gameType = String(t1?.[0]?.gtype || "");

    const payload = {
      meta,
      runners,
      extra: t3,
      roundId,
      gameType,
    };

    dispatch(casinoLiveActions.fetchCasinoMetaSuccess(payload));
    return { success: true, data: payload };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch casino odds";
    dispatch(casinoLiveActions.fetchCasinoMetaFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCasinoLiability = async (roundId: string, silent = false) => {
  if (!roundId) return { success: false, error: "Missing roundId" };
  if (!silent) dispatch(casinoLiveActions.fetchLiabilityStart());

  try {
    const response = await urbApiClient.post("/casino/liability", { roundId });
    const data = Array.isArray(response?.data?.data) ? response.data.data : [];

    dispatch(casinoLiveActions.fetchLiabilitySuccess(data));
    return { success: true, data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch liability";
    dispatch(casinoLiveActions.fetchLiabilityFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCasinoBetListUser = async (
  tableId: string,
  isGameCompleted = false,
  sportId = 5015,
  silent = false
) => {
  if (!tableId) return { success: false, error: "Missing tableId" };
  if (!silent) dispatch(casinoLiveActions.fetchCasinoUserBetsStart());

  try {
    const response = await urbApiClient.post("/casino/casino-bet-list-user", {
      tableId,
      isGameCompleted,
      sportId,
    });
    const data = normalizeCasinoBets(
      Array.isArray(response?.data?.data) ? response.data.data : []
    );

    dispatch(casinoLiveActions.fetchCasinoUserBetsSuccess(data));
    return { success: true, data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch user bets";
    dispatch(casinoLiveActions.fetchCasinoUserBetsFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCasinoRoundResult = async (roundId: string, silent = false) => {
  if (!roundId) return { success: false, error: "Missing roundId" };
  if (!silent) dispatch(casinoLiveActions.fetchCasinoResultStart());

  try {
    const response = await casinoApiClient.get(
      `/betfair_api/casino/result-round-id-wise/${roundId}`
    );
    const result = Array.isArray(response?.data?.data)
      ? response.data.data?.[0] || null
      : null;

    dispatch(casinoLiveActions.fetchCasinoResultSuccess(result));
    return { success: true, data: result };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch result";
    dispatch(casinoLiveActions.fetchCasinoResultFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const fetchCasinoLastResults = async (resultPath: string, silent = false) => {
  if (!resultPath) return { success: false, error: "Missing resultPath" };
  if (!silent) dispatch(casinoLiveActions.fetchCasinoLastResultsStart());

  try {
    const response = await casinoApiClient.get(resultPath);
    const rows = Array.isArray(response?.data) ? response.data : [];
    const data = normalizeResultRows(rows);

    dispatch(casinoLiveActions.fetchCasinoLastResultsSuccess(data));
    return { success: true, data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch last results";
    dispatch(casinoLiveActions.fetchCasinoLastResultsFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const placeCasinoBet = async (params: {
  roundId: string;
  selection: any;
  stake: number;
  tableId: string;
  matchId: string;
  isBack: boolean;
}) => {
  dispatch(casinoLiveActions.placeCasinoBetStart());

  try {
    const odds = params.isBack
      ? toNumber(params.selection?.backOdds || params.selection?.rate)
      : toNumber(params.selection?.layOdds || params.selection?.rate);

    const payload = {
      marketId: params.roundId,
      nation: params.selection?.name || params.selection?.nation || "",
      isBack: params.isBack,
      odds,
      selectionId: String(params.selection?.sid || ""),
      colorName: params.isBack ? "back" : "lay",
      stake: toNumber(params.stake),
      userIp: "0.0.0.0",
      placeTime: getCurrentTimestamp(),
      matchId: String(params.matchId || params.tableId || ""),
      deviceInfo: getDeviceInfo(),
    };

    const response = await urbApiClient.post("/casino/bet-place", payload);

    if (response?.data?.status) {
      const message = response?.data?.message || "Bet Placed";
      dispatch(casinoLiveActions.placeCasinoBetSuccess(message));
      toast.success(message);
      return { success: true, data: response?.data };
    }

    throw new Error(response?.data?.message || "Bet placement failed");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to place bet";
    dispatch(casinoLiveActions.placeCasinoBetFail(errorMessage));
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const clearCasinoLiveState = () => {
  dispatch(casinoLiveActions.clearCasinoLiveState());
};
