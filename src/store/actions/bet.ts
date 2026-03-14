import axios from "axios";
import { toast } from "react-toastify";
import store from "../store";
import { betActions } from "../reducers/bet";
import { fetchBalance } from "./balance";
import { urbApiClient } from "../../config/axiosConfig";

const { dispatch, getState } = store;

const BET_API_URL = "/bet/place";
const GAME_API_URL = "https://oddsapi.247idhub.com/betfair_api/fancy/sap";
const oddsApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

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

const fetchLatestBetData = async (matchId: string, betType: any, clickedOdds: number) => {
  try {
    const response = await oddsApi.get(`${GAME_API_URL}/${matchId}`);

    if (response.data) {
      const gameData = response.data;

      if (!betType.isFancy && gameData.Bookmaker && gameData.Bookmaker.length > 0) {
        const requestedMarketType = String(betType.marketType || "Bookmaker").toLowerCase();

        const filteredMarkets = gameData.Bookmaker.filter((item: any) => {
          const itemType = String(item?.t || "Bookmaker").toLowerCase();
          return itemType === requestedMarketType;
        });

        const marketPool = filteredMarkets.length > 0 ? filteredMarkets : gameData.Bookmaker;

        const bookmaker = marketPool.find((b: any) => {
          if (betType.selectionId != null && String(b.sid) === String(betType.selectionId)) return true;
          if (b.nation === betType.name) return true;
          if (String(b.nation || "").toLowerCase() === String(betType.name || "").toLowerCase()) return true;
          return false;
        });

        if (bookmaker) {
          const latestOdds = betType.type === "back" ? bookmaker.b1 : bookmaker.l1;
          const finalOdds = latestOdds && latestOdds > 0 ? latestOdds : clickedOdds;

          return {
            odds: finalOdds,
            priceValue: finalOdds,
            marketId: bookmaker.mid,
            selectionId: bookmaker.sid || 0,
            marketName: bookmaker.t || betType.marketType || "Bookmaker",
          };
        }
      }

      if (betType.isFancy && gameData.Fancy2 && gameData.Fancy2.length > 0) {
        const fancy = gameData.Fancy2.find((f: any) => {
          if (f.nation === betType.name) return true;
          if (String(f.nation || "").toLowerCase() === String(betType.name || "").toLowerCase()) return true;
          if (String(f.nation || "").toLowerCase().includes(String(betType.name || "").toLowerCase())) return true;
          if (String(betType.name || "").toLowerCase().includes(String(f.nation || "").toLowerCase())) return true;
          return false;
        });

        if (fancy) {
          const latestOdds = betType.type === "yes" ? fancy.b1 : fancy.l1;
          const priceValue = betType.type === "yes" ? fancy.bs1 : fancy.ls1;
          const marketId = fancy.mid || fancy.sid;
          const finalOdds = latestOdds && latestOdds > 0 ? latestOdds : clickedOdds;

          return {
            odds: finalOdds,
            priceValue: priceValue || 0,
            marketId,
            selectionId: 0,
            marketName: "Fancy2",
          };
        }
      }

      if (betType.isFancy && gameData.Fancy && gameData.Fancy.length > 0) {
        const fancy = gameData.Fancy.find((f: any) => {
          if (f.nation === betType.name) return true;
          if (String(f.nation || "").toLowerCase() === String(betType.name || "").toLowerCase()) return true;
          if (String(f.nation || "").toLowerCase().includes(String(betType.name || "").toLowerCase())) return true;
          if (String(betType.name || "").toLowerCase().includes(String(f.nation || "").toLowerCase())) return true;
          return false;
        });

        if (fancy) {
          const latestOdds = betType.type === "yes" ? fancy.b1 : fancy.l1;
          const priceValue = betType.type === "yes" ? fancy.bs1 : fancy.ls1;
          const marketId = fancy.mid || fancy.sid;
          const finalOdds = latestOdds && latestOdds > 0 ? latestOdds : clickedOdds;

          return {
            odds: finalOdds,
            priceValue: priceValue || 0,
            marketId,
            selectionId: 0,
            marketName: "Fancy",
          };
        }
      }
    }

    return null;
  } catch (_error) {
    return null;
  }
};

export const placeBet = async (betData: any) => {
  dispatch(betActions.placeBetStart());

  try {
    const state = getState();
    const token = state.auth.accessToken;

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    if (!betData.odds || betData.odds <= 0) {
      throw new Error("Invalid odds value. Please try again.");
    }

    const isFancy = betData.isFancy === true;
    const isBack = isFancy ? betData.type === "yes" : betData.type === "back";

    const mode = isFancy
      ? betData.type === "yes"
        ? "Yes"
        : "No"
      : betData.type === "back"
      ? "LAGAI"
      : "KHAI";

    const requestedMarketName = isFancy
      ? betData.marketType || "Fancy2"
      : betData.marketType || "Bookmaker";

    // Use the rate the user clicked — do not refresh odds to avoid rate-mismatch errors
    const finalOdds = betData.odds;
    const finalPriceValue = isFancy ? betData.priceValue || 0 : betData.odds;
    const finalMarketId = betData.marketId || "";
    const finalSelectionId = isFancy ? 0 : betData.selectionId || 0;
    const finalMarketName = requestedMarketName;

    if (!finalOdds || finalOdds <= 0) {
      throw new Error(
        `Invalid odds value (${finalOdds}) for "${betData.name}". Please refresh and try again.`
      );
    }

    const payload = {
      isFancy,
      isBack,
      odds: finalOdds,
      marketName: finalMarketName,
      selectionId: isFancy ? 0 : finalSelectionId,
      priceValue: finalPriceValue,
      marketId: finalMarketId,
      name: betData.name,
      matchId: betData.matchId,
      userIp: betData.userIp || "0.0.0.0",
      mode,
      placeTime: getCurrentTimestamp(),
      deviceInfo: getDeviceInfo(),
      stake: betData.stake,
    };

    const response = await urbApiClient.post(BET_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.status) {
      dispatch(betActions.placeBetSuccess(response.data));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchBalance(true);
      return { success: true, data: response.data };
    }

    throw new Error(response.data?.message || "Bet placement failed");
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to place bet";
    dispatch(betActions.placeBetFail(errorMessage));
    toast.error(errorMessage);

    return { success: false, error: errorMessage };
  }
};

export const resetBetState = () => {
  dispatch(betActions.resetBetState());
};
