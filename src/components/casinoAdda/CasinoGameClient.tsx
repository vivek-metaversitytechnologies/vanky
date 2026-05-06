"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearCasinoLiveState,
  fetchCasinoBetListUser,
  fetchCasinoLastResults,
  fetchCasinoLiability,
  fetchCasinoList,
  fetchCasinoMeta,
  fetchCasinoRoundResult,
  placeCasinoBet,
} from "../../store/actions/casinoLive";
import { fetchBalance } from "../../store/actions/balance";
import { CASINO_GAME_BY_CODE } from "../../config/casinoGames";
import "../../styles/casino-live.css";
import "../../styles/casino.css";

interface CasinoGameClientProps {
  gameCode: string;
}

const DEFAULT_STAKE_BUTTONS = [100, 500, 1000, 2000, 5000, 10000, 25000, 50000];

const formatOdds = (value: any) => {
  const num = Number(value);

  if (!Number.isFinite(num)) return "0";

  const rounded = Math.round(num * 100) / 100;
  const isWhole = Math.abs(rounded - Math.trunc(rounded)) < 1e-9;

  return isWhole ? String(Math.trunc(rounded)) : rounded.toFixed(2);
};

const CARD_BASE_URL = "https://versionobj.ecoassetsservice.com/v14/static/front/img/cards";

function getResultInfo(
  result: any,
  config?: { resultMap?: Record<string, { label: string; bg: string }> }
): { label: string; bg: string } {
  const key = String(result || "").trim();
  const normalizedNumberKey = String(Number.parseInt(key, 10));
  const entry = config?.resultMap?.[key] || config?.resultMap?.[normalizedNumberKey];
  if (entry) return entry;
  // fallback
  if (key === "1" || key.toUpperCase() === "A") return { label: "A", bg: "#169731" };
  if (key === "2" || key.toUpperCase() === "B") return { label: "B", bg: "#d0021b" };
  return { label: key || "-", bg: "#434343" };
}

function CardImg({ card }: { card: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${CARD_BASE_URL}/${card}.jpg`}
      alt={card}
      className="result-card-img"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/assets/images/card-close.png";
      }}
    />
  );
}

function ResultPopupContent({
  gameCode,
  lastResult,
  loading,
  selectedRow,
  popupType,
  resultMap,
}: {
  gameCode: string;
  lastResult: any;
  loading: boolean;
  selectedRow: any;
  popupType?: string;
  resultMap?: Record<string, { label: string; bg: string }>;
}) {
  const mid = String(selectedRow?.mid || lastResult?.mid || "-");

  if (loading) {
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-modal-loading">Loading result details...</div>
      </div>
    );
  }

  if (!lastResult) {
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-modal-loading">No detail available.</div>
      </div>
    );
  }

  const rawCards = String(lastResult.cards || lastResult.C1 || "");
  const cards = rawCards.split(",").map((c: string) => c.trim()).filter(Boolean);
  const win = String(lastResult.win || lastResult.result || "");
  const desc = String(lastResult.desc || "");
  const winInfo = getResultInfo(win, { resultMap });

  // Teen Patti — 2 players × 3 cards
  if (popupType === "teen") {
    const aCards = [cards[0], cards[2], cards[4]].filter(Boolean);
    const bCards = [cards[1], cards[3], cards[5]].filter(Boolean);
    const winnerA = win === "1";
    const winnerB = win === "2";
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-popup-players">
          <div className={`result-popup-player${winnerA ? " winner" : ""}`}>
            <div className="result-player-label">
              Player A {winnerA && <span className="result-trophy">&#127942;</span>}
            </div>
            <div className="result-cards-row">
              {aCards.length > 0
                ? aCards.map((card, i) => <CardImg key={i} card={card} />)
                : <span className="result-no-card">—</span>}
            </div>
          </div>
          <div className={`result-popup-player${winnerB ? " winner" : ""}`}>
            <div className="result-player-label">
              Player B {winnerB && <span className="result-trophy">&#127942;</span>}
            </div>
            <div className="result-cards-row">
              {bCards.length > 0
                ? bCards.map((card, i) => <CardImg key={i} card={card} />)
                : <span className="result-no-card">—</span>}
            </div>
          </div>
        </div>
        {desc && <div className="result-desc-row">{desc}</div>}
      </div>
    );
  }

  // Dragon Tiger — 1 card each
  if (popupType === "dt") {
    const descParts = desc.split("*");
    const resultLabel = descParts[0] || (win === "1" ? "Dragon Won" : win === "2" ? "Tiger Won" : "Tie");
    const dragonCard = cards[0];
    const tigerCard = cards[1];
    const winnerD = win === "1";
    const winnerT = win === "2";
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-popup-result-label" style={{ backgroundColor: winInfo.bg }}>
          {resultLabel}
        </div>
        <div className="result-popup-players">
          <div className={`result-popup-player${winnerD ? " winner" : ""}`}>
            <div className="result-player-label">
              Dragon {winnerD && <span className="result-trophy">&#127942;</span>}
            </div>
            <div className="result-cards-row">
              {dragonCard ? <CardImg card={dragonCard} /> : <span className="result-no-card">—</span>}
            </div>
            {descParts[1] && <div className="result-desc-row">{descParts[1]}</div>}
          </div>
          <div className={`result-popup-player${winnerT ? " winner" : ""}`}>
            <div className="result-player-label">
              Tiger {winnerT && <span className="result-trophy">&#127942;</span>}
            </div>
            <div className="result-cards-row">
              {tigerCard ? <CardImg card={tigerCard} /> : <span className="result-no-card">—</span>}
            </div>
            {descParts[2] && <div className="result-desc-row">{descParts[2]}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Lucky 7 — single card + desc rows
  if (popupType === "lucky7") {
    const card = cards[0];
    const descParts = desc.split("||").filter(Boolean);
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-popup-result-label" style={{ backgroundColor: winInfo.bg }}>
          {winInfo.label === "L" ? "Low" : winInfo.label === "H" ? "High" : "Tie"}
        </div>
        <div className="result-popup-single-card">
          {card ? <CardImg card={card} /> : <span className="result-no-card">—</span>}
        </div>
        {descParts.map((d, i) => (
          <div className="result-desc-row" key={i}>{d.trim()}</div>
        ))}
      </div>
    );
  }

  // Amar Akbar Anthony — single/multiple cards + desc rows
  if (popupType === "aaa") {
    const descParts = desc.split("|").filter(Boolean);
    const winner = descParts[0] || (win === "1" ? "Amar" : win === "2" ? "Akbar" : "Anthony");
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-popup-result-label" style={{ backgroundColor: winInfo.bg }}>
          {winner}
        </div>
        <div className="result-cards-row result-popup-multi-card">
          {cards.length > 0
            ? cards.map((card, i) => <CardImg key={i} card={card} />)
            : <span className="result-no-card">—</span>}
        </div>
        {descParts.slice(1).map((d, i) => (
          <div className="result-desc-row" key={i}>{d.trim()}</div>
        ))}
      </div>
    );
  }

  // Andar Bahar — two strips of cards separated by *
  if (popupType === "ab") {
    const [andarRaw = "", baharRaw = ""] = rawCards.split("*");
    const andarCards = andarRaw.split(",").map((c: string) => c.trim()).filter(Boolean);
    const baharCards = baharRaw.split(",").map((c: string) => c.trim()).filter(Boolean);
    const winnerA = win === "1";
    const winnerB = win === "2";
    return (
      <div className="result-popup-body">
        <div className="result-popup-round">Round ID: {mid}</div>
        <div className="result-popup-ab-section">
          <div className={`result-popup-ab-label${winnerA ? " winner" : ""}`}>
            Andar {winnerA && <span className="result-trophy">&#127942;</span>}
          </div>
          <div className="result-cards-row result-ab-cards">
            {andarCards.length > 0
              ? andarCards.map((card, i) => <CardImg key={i} card={card} />)
              : <span className="result-no-card">—</span>}
          </div>
        </div>
        <div className="result-popup-ab-section">
          <div className={`result-popup-ab-label${winnerB ? " winner" : ""}`}>
            Bahar {winnerB && <span className="result-trophy">&#127942;</span>}
          </div>
          <div className="result-cards-row result-ab-cards">
            {baharCards.length > 0
              ? baharCards.map((card, i) => <CardImg key={i} card={card} />)
              : <span className="result-no-card">—</span>}
          </div>
        </div>
        {desc && <div className="result-desc-row">{desc}</div>}
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="result-popup-body">
      <div className="result-popup-round">Round ID: {mid}</div>
      <div className="result-popup-result-label" style={{ backgroundColor: winInfo.bg }}>
        {winInfo.label}
      </div>
      <div className="result-cards-row result-popup-multi-card">
        {cards.length > 0
          ? cards.map((card, i) => <CardImg key={i} card={card} />)
          : <span className="result-no-card">—</span>}
      </div>
      {desc && <div className="result-desc-row">{desc}</div>}
    </div>
  );
}

export default function CasinoGameClient({ gameCode }: CasinoGameClientProps) {
  const [cardsOpen, setCardsOpen] = useState(true);
  const [showBetPopup, setShowBetPopup] = useState(false);
  const [stake, setStake] = useState(100);
  const [selectedRunner, setSelectedRunner] = useState<any>(null);
  const [selectedIsBack, setSelectedIsBack] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [selectedResultRow, setSelectedResultRow] = useState<any>(null);
  const betPanelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = CASINO_GAME_BY_CODE[gameCode];

  const { balance } = useSelector((state: any) => state.balance || {});
  const { user } = useSelector((state: any) => state.auth || {});
  const {
    casinoList,
    meta,
    runners,
    extra,
    roundId,
    userBets,
    liability,
    lastResults,
    lastResult,
    loadingResult,
    placingBet,
  } = useSelector((state: any) => state.casinoLive || {});

  const ptsValue = isHydrated ? Number(balance || 0).toFixed(2) : "0.00";
  const userId = isHydrated ? (user?.username || user?.userId || "") : "";
  const displayRoundId = isHydrated ? (roundId || "-") : "-";
  const hydratedMeta = isHydrated ? meta : [];

  const tableId = useMemo(() => {
    const listName = config?.casinoListName;
    if (!listName || !Array.isArray(casinoList)) return "";
    const found = casinoList.find(
      (item: any) =>
        String(item?.name || "").toLowerCase() === String(listName).toLowerCase()
    );
    return found?.tableId ? String(found.tableId) : "";
  }, [casinoList, config?.casinoListName]);

  const mergedRows = useMemo(() => {
    const liabilityMap = new Map(
      (Array.isArray(liability) ? liability : []).map((row: any) => [
        String(row?.sid || ""),
        Number(row?.liability || 0),
      ])
    );

    return (Array.isArray(runners) ? runners : []).map((row: any) => ({
      ...row,
      pnl: liabilityMap.get(String(row?.sid || "")) || 0,
    }));
  }, [runners, liability]);

  const displayRows = useMemo(() => {
    if (gameCode !== "teenPatti") {
      return mergedRows;
    }

    return mergedRows.filter((row: any) => {
      const name = String(row?.name || "").toLowerCase().trim();
      return name === "player a" || name === "player b";
    });
  }, [gameCode, mergedRows]);

  const rowsForRender = useMemo(() => (isHydrated ? displayRows : []), [displayRows, isHydrated]);
  const resultsForRender = useMemo(
    () => (isHydrated && Array.isArray(lastResults) ? lastResults : []),
    [isHydrated, lastResults]
  );
  const betsForRender = useMemo(
    () => (isHydrated && Array.isArray(userBets) ? userBets : []),
    [isHydrated, userBets]
  );

  const autoTime = Number(Array.isArray(hydratedMeta) ? hydratedMeta?.[0]?.autotime || 0 : 0);

  const videoUrl = useMemo(() => {
    const row = Array.isArray(hydratedMeta) ? hydratedMeta?.[0] || {} : {};
    const candidates = [
      row?.tv,
      row?.tvUrl,
      row?.tvurl,
      row?.video,
      row?.videoUrl,
      row?.stream,
      row?.streamUrl,
      row?.iframe,
      row?.url,
    ];
    const found = candidates.find((item) => typeof item === "string" && item.startsWith("http"));
    return found || "";
  }, [hydratedMeta]);

  const tvCards = useMemo(() => {
    const row = Array.isArray(hydratedMeta) ? hydratedMeta?.[0] || {} : {};
    const read = (upper: string, lower: string) => String((row as any)?.[upper] || (row as any)?.[lower] || "").trim();
    return [
      read("C1", "c1"),
      read("C2", "c2"),
      read("C3", "c3"),
      read("C4", "c4"),
      read("C5", "c5"),
      read("C6", "c6"),
    ];
  }, [hydratedMeta]);

  useEffect(() => {
    setIsHydrated(true);
    fetchBalance(true);
    fetchCasinoList();

    return () => {
      clearCasinoLiveState();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (betPanelTimerRef.current) {
        clearTimeout(betPanelTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!config?.metaPath) return;

    fetchCasinoMeta(config.metaPath);
    if (config?.resultPath) {
      fetchCasinoLastResults(config.resultPath);
    }

    const oddsAndLiabilityInterval = window.setInterval(() => {
      fetchCasinoMeta(config.metaPath, true);
      if (roundId) {
        fetchCasinoLiability(roundId, true);
      }
    }, 1000);

    const betsInterval = window.setInterval(() => {
      if (tableId) {
        fetchCasinoBetListUser(tableId, false, 5015, true);
      }
    }, 3000);

    const resultsInterval = window.setInterval(() => {
      if (config?.resultPath) {
        fetchCasinoLastResults(config.resultPath, true);
      }
    }, 5000);

    return () => {
      window.clearInterval(oddsAndLiabilityInterval);
      window.clearInterval(betsInterval);
      window.clearInterval(resultsInterval);
    };
  }, [config?.metaPath, config?.resultPath, roundId, tableId]);

  const handleOpenResultPopup = async (resultRow: any) => {
    const clickedRoundId = String(resultRow?.mid || "");
    if (!clickedRoundId) return;

    setSelectedResultRow(resultRow);
    setShowResultPopup(true);
    await fetchCasinoRoundResult(clickedRoundId);
  };

  const openBetPopup = (runner: any, isBack: boolean) => {
    const marketStatus = String(runner?.gstatus ?? "").toUpperCase();
    const isSuspended =
      marketStatus === "SUSPENDED" ||
      marketStatus === "SUSPEND" ||
      runner?.gstatus === 0 ||
      runner?.gstatus === "0";

    const odds = isBack
      ? Number(runner?.backOdds || runner?.rate || 0)
      : Number(runner?.layOdds || runner?.rate || 0);

    if (isSuspended || !odds || odds <= 0) {
      toast.info("Market locked");
      return;
    }

    setSelectedRunner(runner);
    setSelectedIsBack(isBack);
    setShowBetPopup(true);

    if (betPanelTimerRef.current) {
      clearTimeout(betPanelTimerRef.current);
    }

    betPanelTimerRef.current = setTimeout(() => {
      setShowBetPopup(false);
      setSelectedRunner(null);
    }, 10000);
  };

  const handlePlaceBet = async () => {
    if (!selectedRunner || !roundId || !tableId) {
      toast.error("Bet data is missing");
      return;
    }

    if (!stake || Number(stake) <= 0) {
      toast.error("Please enter a valid stake");
      return;
    }

    const result = await placeCasinoBet({
      roundId,
      selection: selectedRunner,
      stake: Number(stake),
      tableId,
      matchId: tableId,
      isBack: selectedIsBack,
    });

    if (result.success) {
      setShowBetPopup(false);
      setSelectedRunner(null);

      if (betPanelTimerRef.current) {
        clearTimeout(betPanelTimerRef.current);
      }

      fetchCasinoBetListUser(tableId, false, 5015, true);
      fetchCasinoLiability(roundId, true);
      fetchBalance(true);
    }
  };

  const renderOddButton = (runner: any, isBack: boolean) => {
    const marketStatus = String(runner?.gstatus ?? "").toUpperCase();
    const isSuspended =
      marketStatus === "SUSPENDED" ||
      marketStatus === "SUSPEND" ||
      runner?.gstatus === 0 ||
      runner?.gstatus === "0";

    const odds = isBack
      ? Number(runner?.backOdds || runner?.rate || 0)
      : Number(runner?.layOdds || runner?.rate || 0);

    if (isSuspended || !odds || odds <= 0) {
      return (
        <button className={isBack ? "back" : "lay"} disabled>
          <i className="fa-solid fa-lock"></i>
        </button>
      );
    }

    return (
      <button
        className={isBack ? "back" : "lay"}
        onClick={() => openBetPopup(runner, isBack)}
      >
        {formatOdds(odds)}
      </button>
    );
  };

  const isRunnerLocked = (runner: any, isBack: boolean) => {
    const marketStatus = String(runner?.gstatus ?? "").toUpperCase();
    const odds = isBack
      ? Number(runner?.backOdds || runner?.rate || 0)
      : Number(runner?.layOdds || runner?.rate || 0);

    return (
      marketStatus === "SUSPENDED" ||
      marketStatus === "SUSPEND" ||
      runner?.gstatus === 0 ||
      runner?.gstatus === "0" ||
      !odds ||
      odds <= 0
    );
  };

  const lucky7RowsOrdered = useMemo(() => {
    if (gameCode !== "ODLucky7") return [] as any[];
    return rowsForRender;
  }, [rowsForRender, gameCode]);

  const getLucky7Runner = (keys: string[], fallbackIndex?: number) => {
    const loweredKeys = keys.map((k) => k.toLowerCase());
    const matched = lucky7RowsOrdered.find((row: any) => {
      const name = String(row?.name || "").toLowerCase();
      return loweredKeys.some((key) => name.includes(key));
    });

    if (matched) return matched;
    if (typeof fallbackIndex === "number") return lucky7RowsOrdered[fallbackIndex];
    return undefined;
  };

  const lucky7CardRows = useMemo(() => {
    if (gameCode !== "ODLucky7") return [] as any[];

    const cardRanks = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    const readRank = (name: string) => {
      const raw = String(name || "").toLowerCase().replace(/card|cards|\s+/g, "");
      if (raw === "1") return "a";
      if (cardRanks.includes(raw)) return raw;
      return "";
    };

    const ranked = rowsForRender
      .map((row: any) => ({ row, rank: readRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => cardRanks.indexOf(a.rank) - cardRanks.indexOf(b.rank));

    if (ranked.length > 0) return ranked;

    return rowsForRender.slice(6).map((row: any, index: number) => ({
      row,
      rank: String(index + 1),
    }));
  }, [rowsForRender, gameCode]);

  const renderLucky7Tile = (
    runner: any,
    className: string,
    label: React.ReactNode,
    accentClass: string
  ) => {
    if (!runner) {
      return <div className={`lucky7-tile ${className} ${accentClass} disabled`} />;
    }

    const marketStatus = String(runner?.gstatus ?? "").toUpperCase();
    const isLocked =
      marketStatus === "SUSPENDED" ||
      marketStatus === "SUSPEND" ||
      runner?.gstatus === 0 ||
      runner?.gstatus === "0" ||
      Number(runner?.backOdds || runner?.rate || 0) <= 0;

    const odds = Number(runner?.backOdds || runner?.rate || 0);

    return (
      <button
        className={`lucky7-tile ${className} ${accentClass}${isLocked ? " locked" : ""}`}
        disabled={isLocked}
        onClick={() => openBetPopup(runner, true)}
      >
        <span className="lucky7-tile-odds">{formatOdds(odds)}</span>
        <span className="lucky7-tile-label">{label}</span>
        <span className="lucky7-tile-pnl">{Number(runner?.pnl || 0).toFixed(1)}</span>
        {isLocked && (
          <span className="lucky7-tile-lock">
            <i className="fa-solid fa-lock"></i>
          </span>
        )}
      </button>
    );
  };

  const dtRowsOrdered = useMemo(() => {
    if (gameCode !== "ODdt20" && gameCode !== "ODDT202") return [] as any[];
    return rowsForRender;
  }, [rowsForRender, gameCode]);

  const getDtRunner = (keys: string[], fallbackIndex?: number, excludes: string[] = []) => {
    const loweredKeys = keys.map((k) => k.toLowerCase());
    const loweredExcludes = excludes.map((k) => k.toLowerCase());

    const matched = dtRowsOrdered.find((row: any) => {
      const name = String(row?.name || "").toLowerCase();
      const hasKey = loweredKeys.every((key) => name.includes(key));
      const hasExcluded = loweredExcludes.some((key) => name.includes(key));
      return hasKey && !hasExcluded;
    });

    if (matched) return matched;
    if (typeof fallbackIndex === "number") return dtRowsOrdered[fallbackIndex];
    return undefined;
  };

  const dtCardRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const toCardRank = (name: string) => {
    const n = String(name || "")
      .toLowerCase()
      .replace(/dragon|tiger|andar|bahar|card|cards|\s+/g, "")
      .trim();

    if (!n) return "";
    if (n === "1") return "A";
    if (n === "11") return "J";
    if (n === "12") return "Q";
    if (n === "13") return "K";

    const upper = n.toUpperCase();
    if (dtCardRanks.includes(upper)) return upper;
    return "";
  };

  const dragonCardRows = useMemo(() => {
    if (gameCode !== "ODdt20" && gameCode !== "ODDT202") return [] as any[];

    const parsed = dtRowsOrdered
      .filter((row: any) => String(row?.name || "").toLowerCase().includes("dragon"))
      .map((row: any) => ({ row, rank: toCardRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => dtCardRanks.indexOf(a.rank) - dtCardRanks.indexOf(b.rank));

    if (parsed.length > 0) return parsed;

    return dtRowsOrdered.slice(8, 21).map((row: any, idx: number) => ({
      row,
      rank: dtCardRanks[idx] || String(idx + 1),
    }));
  }, [dtRowsOrdered, gameCode]);

  const tigerCardRows = useMemo(() => {
    if (gameCode !== "ODdt20" && gameCode !== "ODDT202") return [] as any[];

    const parsed = dtRowsOrdered
      .filter((row: any) => String(row?.name || "").toLowerCase().includes("tiger"))
      .map((row: any) => ({ row, rank: toCardRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => dtCardRanks.indexOf(a.rank) - dtCardRanks.indexOf(b.rank));

    if (parsed.length > 0) return parsed;

    return dtRowsOrdered.slice(25, 38).map((row: any, idx: number) => ({
      row,
      rank: dtCardRanks[idx] || String(idx + 1),
    }));
  }, [dtRowsOrdered, gameCode]);

  const renderDtTile = (
    runner: any,
    label: React.ReactNode,
    className: string,
    oddsOverride?: string | number
  ) => {
    if (!runner) {
      return (
        <div className={`dt-tile ${className} locked disabled`}>
          <span className="dt-tile-odds">{oddsOverride ? formatOdds(oddsOverride) : "0"}</span>
          <span className="dt-tile-label">{label}</span>
          <span className="dt-tile-pnl">0.0</span>
          <span className="dt-tile-lock">
            <i className="fa-solid fa-lock"></i>
          </span>
        </div>
      );
    }

    const locked = isRunnerLocked(runner, true);
    const odds = oddsOverride ?? Number(runner?.backOdds || runner?.rate || 0);

    return (
      <button
        className={`dt-tile ${className}${locked ? " locked" : ""}`}
        disabled={locked}
        onClick={() => openBetPopup(runner, true)}
      >
        <span className="dt-tile-odds">{formatOdds(odds)}</span>
        <span className="dt-tile-label">{label}</span>
        <span className="dt-tile-pnl">{Number(runner?.pnl || 0).toFixed(1)}</span>
        {locked && (
          <span className="dt-tile-lock">
            <i className="fa-solid fa-lock"></i>
          </span>
        )}
      </button>
    );
  };

  const aaaRowsOrdered = useMemo(() => {
    if (gameCode !== "ODaaa") return [] as any[];
    return rowsForRender;
  }, [rowsForRender, gameCode]);

  const getAaaRunner = (keys: string[], fallbackIndex?: number, excludes: string[] = []) => {
    const loweredKeys = keys.map((k) => k.toLowerCase());
    const loweredExcludes = excludes.map((k) => k.toLowerCase());

    const matched = aaaRowsOrdered.find((row: any) => {
      const name = String(row?.name || "").toLowerCase();
      const hasKey = loweredKeys.every((key) => name.includes(key));
      const hasExcluded = loweredExcludes.some((key) => name.includes(key));
      return hasKey && !hasExcluded;
    });

    if (matched) return matched;
    if (typeof fallbackIndex === "number") return aaaRowsOrdered[fallbackIndex];
    return undefined;
  };

  const aaaCardRows = useMemo(() => {
    if (gameCode !== "ODaaa") return [] as any[];

    const parsed = aaaRowsOrdered
      .filter((row: any) => {
        const n = String(row?.name || "").toLowerCase();
        return n.includes("card") || /\b(a|k|q|j|10|9|8|7|6|5|4|3|2)\b/.test(n);
      })
      .map((row: any) => ({ row, rank: toCardRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => dtCardRanks.indexOf(a.rank) - dtCardRanks.indexOf(b.rank));

    if (parsed.length > 0) return parsed;

    return aaaRowsOrdered.slice(9, 22).map((row: any, idx: number) => ({
      row,
      rank: dtCardRanks[idx] || String(idx + 1),
    }));
  }, [aaaRowsOrdered, gameCode]);

  const renderAaaMainRow = (runner: any, label: string, oddsFallback: string) => {
    const locked = !runner || isRunnerLocked(runner, true);
    const odds = oddsFallback;
    const pnl = runner ? Number(runner?.pnl || 0).toFixed(1) : "0.0";

    return (
      <div className={`aaa-main-row${locked ? " locked" : ""}`}>
        <div className="aaa-main-left">
          <span className="aaa-main-label">{label}</span>
          <span className="aaa-main-pnl">{pnl}</span>
        </div>
        <button
          className="aaa-main-right"
          disabled={locked}
          onClick={() => runner && openBetPopup(runner, true)}
        >
          <span>{odds}</span>
          {locked && (
            <span className="aaa-lock">
              <i className="fa-solid fa-lock"></i>
            </span>
          )}
        </button>
      </div>
    );
  };

  const renderAaaSmallTile = (
    runner: any,
    label: React.ReactNode,
    oddsFallback: string,
    className?: string
  ) => {
    const locked = !runner || isRunnerLocked(runner, true);
    const pnl = runner ? Number(runner?.pnl || 0).toFixed(1) : "0.0";

    return (
      <button
        className={`aaa-small-tile${className ? ` ${className}` : ""}${locked ? " locked" : ""}`}
        disabled={locked}
        onClick={() => runner && openBetPopup(runner, true)}
      >
        <div className="aaa-small-odds">{oddsFallback}</div>
        <div className="aaa-small-label">{label}</div>
        <div className="aaa-small-pnl">{pnl}</div>
        {locked && (
          <span className="aaa-lock">
            <i className="fa-solid fa-lock"></i>
          </span>
        )}
      </button>
    );
  };

  const abRowsOrdered = useMemo(() => {
    if (gameCode !== "ODab20") return [] as any[];
    return rowsForRender;
  }, [rowsForRender, gameCode]);

  const getAbRunner = (keys: string[], fallbackIndex?: number) => {
    const lowered = keys.map((k) => k.toLowerCase());
    const matched = abRowsOrdered.find((row: any) => {
      const name = String(row?.name || "").toLowerCase();
      return lowered.every((k) => name.includes(k));
    });
    if (matched) return matched;
    if (typeof fallbackIndex === "number") return abRowsOrdered[fallbackIndex];
    return undefined;
  };

  const abAndarRows = useMemo(() => {
    if (gameCode !== "ODab20") return [] as any[];
    const parsed = abRowsOrdered
      .filter((row: any) => String(row?.name || "").toLowerCase().includes("andar"))
      .map((row: any) => ({ row, rank: toCardRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => dtCardRanks.indexOf(a.rank) - dtCardRanks.indexOf(b.rank));

    if (parsed.length >= 13) return parsed.slice(0, 13);

    const base = abRowsOrdered.slice(1, 14).map((row: any, idx: number) => ({
      row,
      rank: dtCardRanks[idx] || String(idx + 1),
    }));

    const filled = [...base];
    while (filled.length < 13) {
      filled.push({ row: undefined, rank: dtCardRanks[filled.length] });
    }
    return filled;
  }, [abRowsOrdered, gameCode]);

  const abBaharRows = useMemo(() => {
    if (gameCode !== "ODab20") return [] as any[];
    const parsed = abRowsOrdered
      .filter((row: any) => String(row?.name || "").toLowerCase().includes("bahar"))
      .map((row: any) => ({ row, rank: toCardRank(row?.name || "") }))
      .filter((item) => !!item.rank)
      .sort((a, b) => dtCardRanks.indexOf(a.rank) - dtCardRanks.indexOf(b.rank));

    if (parsed.length >= 13) return parsed.slice(0, 13);

    const base = abRowsOrdered.slice(14, 27).map((row: any, idx: number) => ({
      row,
      rank: dtCardRanks[idx] || String(idx + 1),
    }));

    const filled = [...base];
    while (filled.length < 13) {
      filled.push({ row: undefined, rank: dtCardRanks[filled.length] });
    }
    return filled;
  }, [abRowsOrdered, gameCode]);

  const renderAbCardTile = (runner: any, rank: string) => {
    const locked = !runner || isRunnerLocked(runner, true);
    const pnl = runner ? Number(runner?.pnl || 0).toFixed(1) : "0.0";

    return (
      <button
        className={`ab-card-tile${locked ? " locked" : ""}`}
        disabled={locked}
        onClick={() => runner && openBetPopup(runner, true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/card-close.png"
          alt="card"
          className="ab-card-img"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/assets/images/card-close.png";
          }}
        />
        <div className="ab-card-rank">{rank}</div>
        <div className="ab-card-pnl">{pnl}</div>
        {locked && (
          <span className="aaa-lock">
            <i className="fa-solid fa-lock"></i>
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="casino-page live">
      <header className="casino-header flex justify-between items-center px-4 py-3">
        <Link href="/CasinoAdda">
          <h1 className="casino-title">HOME</h1>
        </Link>

        <div className="live-right flex items-center gap-4">
          <p className="balance">
            <span>Pts:</span> <span className="bal">{ptsValue}</span>
          </p>

          <div className="live-user flex items-center gap-2">
            <span className="icon">
              <i className="fa-solid fa-user casino-user-icon"></i>
            </span>
            <span className="casino-username">{userId}</span>
          </div>
        </div>
      </header>

      <div className="casino-main live-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9">
            <div className="casino-left">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-12">
                  <div className="casino-video-box relative">
                    <div className="casino-tv-overlay-head">
                      <span className="casino-game-title tv-title-main">
                        {(config?.displayName || gameCode).toUpperCase()}
                      </span>
                      <span className="casino-round-id tv-title-round" suppressHydrationWarning>
                        Round ID: {displayRoundId}
                      </span>
                    </div>

                    <div className="casino-tv-overlay-cards">
                      <div className={`casino-cards-box ${cardsOpen ? "open" : "closed"}`}>
                        <div className="cards-row">
                          {tvCards.slice(0, 3).map((card, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i}
                              src={card ? `${CARD_BASE_URL}/${card}.jpg` : "/assets/images/card-close.png"}
                              alt="card"
                              className="card-img"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/assets/images/card-close.png";
                              }}
                            />
                          ))}
                        </div>

                        <div className="cards-row">
                          {tvCards.slice(3, 6).map((card, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i + 3}
                              src={card ? `${CARD_BASE_URL}/${card}.jpg` : "/assets/images/card-close.png"}
                              alt="card"
                              className="card-img"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/assets/images/card-close.png";
                              }}
                            />
                          ))}
                        </div>

                        <span className="cards-toggle" onClick={() => setCardsOpen(!cardsOpen)}>
                          <i className="fa-solid fa-grip-lines"></i>
                        </span>
                      </div>
                    </div>

                    <div className="casino-video-icons absolute">
                      <Link href="/CasinoAdda">
                        <div className="video-icon-circle">
                          <i className="fa-solid fa-house"></i>
                        </div>
                      </Link>
                      <div
                        className="video-icon-circle"
                        role="button"
                        tabIndex={0}
                        onClick={() => toast.info("Rules will be available here.")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toast.info("Rules will be available here.");
                          }
                        }}
                      >
                        <i className="fa-solid fa-circle-info"></i>
                      </div>
                    </div>

                    <div className="casino-video-frame relative">
                      {videoUrl ? (
                        <iframe
                          src={videoUrl}
                          title="Casino TV"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      ) : null}
                    </div>
                    {!videoUrl && <div className="video-loader"></div>}
                    <div className="countdown-circle">{Number.isFinite(autoTime) ? autoTime : 0}</div>
                  </div>
                </div>

                <div className="md:col-span-12">
                  <div className="live-casino-odds-panel">
                    {gameCode === "ODab20" ? (
                      <div className="ab-odds-board">
                        <div className="ab-two-cols">
                          <div className="ab-col">
                            <h5 className="ab-col-head">
                              <span className="ab-title">Andar</span>
                              <span className="ab-odds">1.96</span>
                            </h5>
                            <div className="ab-card-row">
                              {abAndarRows.map(({ row, rank }) => (
                                <React.Fragment key={`ab-andar-${row?.sid || rank}-${row?.mid || ""}`}>
                                  {renderAbCardTile(row, rank)}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div className="ab-col">
                            <h5 className="ab-col-head">
                              <span className="ab-title">Bahar</span>
                              <span className="ab-odds">1.96</span>
                            </h5>
                            <div className="ab-card-row">
                              {abBaharRows.map(({ row, rank }) => (
                                <React.Fragment key={`ab-bahar-${row?.sid || rank}-${row?.mid || ""}`}>
                                  {renderAbCardTile(row, rank)}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : gameCode === "ODaaa" ? (
                      <div className="aaa-odds-board">
                        <div className="aaa-main-rows">
                          {renderAaaMainRow(getAaaRunner(["amar"], 0), "A. Amar", "2.00")}
                          {renderAaaMainRow(getAaaRunner(["akbar"], 1), "B. Akbar", "3.00")}
                          {renderAaaMainRow(getAaaRunner(["anthony"], 2), "C. Anthony", "4.00")}
                        </div>

                        <div className="aaa-option-groups">
                          <div className="aaa-option-group">
                            {renderAaaSmallTile(getAaaRunner(["even"], 3), "Even", "2.12")}
                            {renderAaaSmallTile(getAaaRunner(["odd"], 4), "Odd", "1.83")}
                          </div>

                          <div className="aaa-option-group">
                            {renderAaaSmallTile(
                              getAaaRunner(["black"], 5),
                              <span className="lucky7-suit black">♠ ♣</span>,
                              "1.97"
                            )}
                            {renderAaaSmallTile(
                              getAaaRunner(["red"], 6),
                              <span className="lucky7-suit red">♥ ♦</span>,
                              "1.97"
                            )}
                          </div>

                          <div className="aaa-option-group">
                            {renderAaaSmallTile(getAaaRunner(["under", "7"], 7), "Under 7", "2.00")}
                            {renderAaaSmallTile(getAaaRunner(["over", "7"], 8), "Over 7", "2.00")}
                          </div>
                        </div>

                        <div className="aaa-card-strip">
                          <div className="aaa-card-strip-odds">12.00</div>
                          <div className="aaa-card-row">
                            {aaaCardRows.map(({ row, rank }) => (
                              <React.Fragment key={`aaa-${row?.sid || rank}-${row?.mid || ""}`}>
                                {renderAaaSmallTile(row, rank, "12.00", "card")}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : gameCode === "ODdt20" || gameCode === "ODDT202" ? (
                      <div className="dt20-odds-board">
                        <div className="dt20-main-row">
                          {renderDtTile(
                            getDtRunner(["dragon"], 0, ["even", "odd", "spade", "club", "heart", "diamond", "black", "red"]),
                            "Dragon",
                            "main dragon",
                            1.96
                          )}
                          {renderDtTile(getDtRunner(["tie"], 1), "Tie", "main tie-circle", 8)}
                          {renderDtTile(
                            getDtRunner(["tiger"], 2, ["even", "odd", "spade", "club", "heart", "diamond", "black", "red"]),
                            "Tiger",
                            "main tiger",
                            1.96
                          )}
                        </div>

                        <div className="dt20-pair-row">
                          {renderDtTile(getDtRunner(["pair"], 3), "Pair", "main pair", 6)}
                        </div>

                        <div className="dt20-sides-row">
                          <div className="dt20-side-box">
                            <div className="dt20-side-head">
                              <span className="dt20-side-title">Dragon</span>
                              <span className="dt20-side-odds">2.10</span>
                              <span className="dt20-side-odds">1.79</span>
                              <span className="dt20-side-odds">1.95</span>
                              <span className="dt20-side-odds">1.95</span>
                            </div>

                            <div className="dt20-side-four">
                              {renderDtTile(getDtRunner(["dragon", "even"], 4), "Even", "small")}
                              {renderDtTile(getDtRunner(["dragon", "odd"], 5), "Odd", "small")}
                              {renderDtTile(getDtRunner(["dragon", "black"], 6), <span className="lucky7-suit black">♠ ♣</span>, "small")}
                              {renderDtTile(getDtRunner(["dragon", "red"], 7), <span className="lucky7-suit red">♥ ♦</span>, "small")}
                            </div>

                            {dragonCardRows.length > 0 && (
                              <>
                                <div className="dt20-card-title">12</div>
                                <div className="dt20-card-row">
                                  {dragonCardRows.map(({ row, rank }) => (
                                    <React.Fragment key={`dragon-${row?.sid || rank}-${row?.mid || ""}`}>
                                      {renderDtTile(row, rank, "card")}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="dt20-side-box">
                            <div className="dt20-side-head">
                              <span className="dt20-side-title">Tiger</span>
                              <span className="dt20-side-odds">2.10</span>
                              <span className="dt20-side-odds">1.79</span>
                              <span className="dt20-side-odds">1.95</span>
                              <span className="dt20-side-odds">1.95</span>
                            </div>

                            <div className="dt20-side-four">
                              {renderDtTile(getDtRunner(["tiger", "even"], 21), "Even", "small")}
                              {renderDtTile(getDtRunner(["tiger", "odd"], 22), "Odd", "small")}
                              {renderDtTile(getDtRunner(["tiger", "black"], 23), <span className="lucky7-suit black">♠ ♣</span>, "small")}
                              {renderDtTile(getDtRunner(["tiger", "red"], 24), <span className="lucky7-suit red">♥ ♦</span>, "small")}
                            </div>

                            {tigerCardRows.length > 0 && (
                              <>
                                <div className="dt20-card-title">12</div>
                                <div className="dt20-card-row">
                                  {tigerCardRows.map(({ row, rank }) => (
                                    <React.Fragment key={`tiger-${row?.sid || rank}-${row?.mid || ""}`}>
                                      {renderDtTile(row, rank, "card")}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : gameCode === "ODLucky7" ? (
                      <div className="lucky7-odds-board">
                        <div className="lucky7-top-row">
                          {renderLucky7Tile(getLucky7Runner(["low"], 0), "lucky7-wide", "LOW CARD", "low")}
                          <div className="lucky7-center-card">7</div>
                          {renderLucky7Tile(getLucky7Runner(["high"], 1), "lucky7-wide", "HIGH CARD", "high")}
                        </div>

                        <div className="lucky7-mid-row">
                          {renderLucky7Tile(getLucky7Runner(["even"], 2), "", "Even", "neutral")}
                          {renderLucky7Tile(getLucky7Runner(["odd"], 3), "", "Odd", "neutral")}
                          {renderLucky7Tile(
                            getLucky7Runner(["spade", "club", "black"], 4),
                            "",
                            <span className="lucky7-suit black">♠ ♣</span>,
                            "neutral"
                          )}
                          {renderLucky7Tile(
                            getLucky7Runner(["heart", "diamond", "red"], 5),
                            "",
                            <span className="lucky7-suit red">♥ ♦</span>,
                            "neutral"
                          )}
                        </div>

                        {lucky7CardRows.length > 0 && (
                          <>
                            <div className="lucky7-card-title">9</div>
                            <div className="lucky7-card-row">
                              {lucky7CardRows.map(({ row, rank }) => (
                                <React.Fragment key={`${row?.sid || rank}-${row?.mid || ""}`}>
                                  {renderLucky7Tile(
                                    row,
                                    "lucky7-card-tile",
                                    rank.toUpperCase(),
                                    "neutral"
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <ul className="panel-header">
                          <li><b className="text-sm">Main</b></li>
                          <li><b className="text-sm">Back</b></li>
                          {gameCode !== "teenPatti" && <li><b className="text-sm">Lay</b></li>}
                        </ul>

                        {rowsForRender.length > 0 ? (
                          rowsForRender.map((runner: any) => (
                            <ul className="player-row" key={`${runner.mid}-${runner.sid}`}>
                              <li>
                                <span className="player-name">{runner.name}</span>
                                <div className="player-score">{Number(runner.pnl || 0).toFixed(2)}</div>
                              </li>

                              <li className="bet-btn bet-back-btn">{renderOddButton(runner, true)}</li>

                              {gameCode !== "teenPatti" && (
                                <li className="bet-btn bet-lay-btn">{renderOddButton(runner, false)}</li>
                              )}
                            </ul>
                          ))
                        ) : (
                          <div className="mybets-empty">No odds available right now.</div>
                        )}
                      </>
                    )}
                  </div>

                  {showBetPopup && selectedRunner && (
                    <div className="betting-box betting-placebet mt-2">
                      <div className="placebet-header">
                        <h2 className="betting-title">PLACE BET</h2>
                        <span className="bet-range">Auto close: 10s</span>
                      </div>

                      <div className="bet-info-header">
                        <span>(Bet for)</span>
                        <span>Odds</span>
                        <span>Stake</span>
                        <span>Profit</span>
                      </div>

                      <div className="bet-info grid grid-cols-4 gap-2 items-center p-2">
                        <span className="font-semibold text-sm">{selectedRunner.name}</span>
                        <span>
                          {selectedIsBack
                            ? formatOdds(selectedRunner.backOdds || selectedRunner.rate)
                            : formatOdds(selectedRunner.layOdds || selectedRunner.rate)}
                        </span>
                        <input
                          type="number"
                          value={stake}
                          onChange={(e) => setStake(Number(e.target.value || 0))}
                          className="bet-input text-sm"
                        />
                        <div className={stake >= 0 ? "profit-positive" : "profit-negative"}>
                          {(
                            Number(stake || 0) *
                            Number(
                              selectedIsBack
                                ? selectedRunner.backOdds || selectedRunner.rate
                                : selectedRunner.layOdds || selectedRunner.rate
                            )
                          ).toFixed(2)}
                        </div>
                      </div>

                      <div className="stake-buttons grid grid-cols-4 gap-1 mt-1">
                        {DEFAULT_STAKE_BUTTONS.map((value) => (
                          <button className="stake-btn" key={value} onClick={() => setStake(value)}>
                            {value}
                          </button>
                        ))}
                      </div>

                      <div className="bet-actions flex gap-2 mt-2">
                        <button className="bet-btn reset-btn flex-1" onClick={() => setStake(0)}>
                          Reset
                        </button>
                        <button
                          className="bet-btn submit-btn flex-1"
                          onClick={handlePlaceBet}
                          disabled={placingBet}
                        >
                          {placingBet ? "Placing..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="casino-right flex flex-col gap-4">
              <div className="betting-box betting-last-results">
                <ul className="results-list casino-last-result">
                  {resultsForRender.length > 0 ? (
                    resultsForRender.slice(0, 10).map((resultRow: any, index: number) => {
                      const info = getResultInfo(resultRow?.result, config);
                      return (
                        <li
                          key={`${resultRow?.mid || index}`}
                          className="result-item"
                          style={{ color: info.bg === "#434343" ? "#fdcf13" : info.bg }}
                          onClick={() => handleOpenResultPopup(resultRow)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleOpenResultPopup(resultRow);
                            }
                          }}
                        >
                          {info.label}
                        </li>
                      );
                    })
                  ) : (
                    <div className="mybets-empty">No results.</div>
                  )}
                </ul>
              </div>

              <div className="betting-box betting-mybets">
                <h2 className="betting-title">MY BETS</h2>

                <div className="mybets-header grid grid-cols-4">
                  <span>Name</span>
                  <span>Odds</span>
                  <span>Stake</span>
                  <span>P/L</span>
                </div>

                {betsForRender.length > 0 ? (
                  betsForRender.slice(0, 8).map((bet: any, index: number) => (
                    <div className="mybets-header grid grid-cols-4" key={`${bet?.id || index}`}>
                      <span>{bet?.selectionName || "-"}</span>
                      <span>{Number(bet?.odds || 0).toFixed(2)}</span>
                      <span>{Number(bet?.stake || 0)}</span>
                      <span>{Number(bet?.pnl || 0).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="mybets-empty">No bets placed yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResultPopup && (
        <div className="rules-modal-overlay" onClick={() => setShowResultPopup(false)}>
          <div className="rules-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rules-modal-box">
              <div className="rules-modal-header">
                <h3 className="rules-title">LAST RESULT</h3>
                <button
                  className="rules-close-btn"
                  type="button"
                  onClick={() => setShowResultPopup(false)}
                >
                  ×
                </button>
              </div>

              <div className="rules-list result-modal-body">
                <ResultPopupContent
                  gameCode={gameCode}
                  lastResult={lastResult}
                  loading={loadingResult}
                  selectedRow={selectedResultRow}
                  popupType={config?.popupType}
                  resultMap={config?.resultMap}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
