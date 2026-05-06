"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
  const entry = config?.resultMap?.[key];
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
  const userId = isHydrated ? (user?.userId || "") : "";

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

  const autoTime = Number(Array.isArray(meta) ? meta?.[0]?.autotime || 0 : 0);

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
    const odds = isBack
      ? Number(runner?.backOdds || runner?.rate || 0)
      : Number(runner?.layOdds || runner?.rate || 0);

    if (!odds || odds <= 0) {
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
    const marketStatus = String(runner?.gstatus || "").toUpperCase();
    const isSuspended = marketStatus === "SUSPENDED" || marketStatus === "SUSPEND";

    const odds = isBack
      ? Number(runner?.backOdds || runner?.rate || 0)
      : Number(runner?.layOdds || runner?.rate || 0);

    if (isSuspended || !odds || odds <= 0) {
      return (
        <button className="lay" disabled>
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
                <div className="md:col-span-3">
                  <div className="min-wrapper">
                    <div className="casino-left-header">
                      <span className="casino-game-title">
                        {(config?.displayName || gameCode).toUpperCase()}
                      </span>
                      <span className="casino-round-id">
                        Round ID: {roundId || "-"}
                      </span>
                    </div>

                    <div className={`casino-cards-box ${cardsOpen ? "open" : "closed"}`}>
                      <div className="cards-row">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Image
                            key={i}
                            src="/assets/images/card-close.png"
                            alt="card"
                            width={30}
                            height={30}
                            className="card-img"
                          />
                        ))}
                      </div>

                      <div className="cards-row">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Image
                            key={i + 3}
                            src="/assets/images/card-close.png"
                            alt="card"
                            width={30}
                            height={30}
                            className="card-img"
                          />
                        ))}
                      </div>

                      <span className="cards-toggle" onClick={() => setCardsOpen(!cardsOpen)}>
                        <i className="fa-solid fa-grip-lines"></i>
                      </span>
                    </div>

                  </div>
                </div>

                <div className="md:col-span-9">
                  <div className="casino-video-box relative">
                    <div className="casino-video-icons absolute">
                      <Link href="/CasinoAdda">
                        <div className="video-icon-circle">
                          <i className="fa-solid fa-house"></i>
                        </div>
                      </Link>
                    </div>

                    <div className="casino-video-frame relative"></div>
                    <div className="video-loader"></div>
                    <div className="countdown-circle">{Number.isFinite(autoTime) ? autoTime : 0}</div>
                  </div>
                </div>

                <div className="md:col-span-12">
                  <div className="live-casino-odds-panel">
                    <ul className="panel-header">
                      <li><b className="text-sm">Main</b></li>
                      <li><b className="text-sm">Back</b></li>
                      <li><b className="text-sm">Lay</b></li>
                    </ul>

                    {displayRows.length > 0 ? (
                      displayRows.map((runner: any) => (
                        <ul className="player-row" key={`${runner.mid}-${runner.sid}`}>
                          <li>
                            <span className="player-name">{runner.name}</span>
                            <div className="player-score">{Number(runner.pnl || 0).toFixed(2)}</div>
                          </li>

                          <li className="bet-btn bet-back-btn">{renderOddButton(runner, true)}</li>

                          <li className="bet-btn bet-lay-btn">{renderOddButton(runner, false)}</li>
                        </ul>
                      ))
                    ) : (
                      <div className="mybets-empty">No odds available right now.</div>
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
                <h2 className="betting-title">LAST RESULTS</h2>

              <div className="results-list">
                  {Array.isArray(lastResults) && lastResults.length > 0 ? (
                    lastResults.slice(0, 10).map((resultRow: any, index: number) => {
                      const info = getResultInfo(resultRow?.result, config);
                      return (
                        <div
                          key={`${resultRow?.mid || index}`}
                          className="result-item"
                          style={{ backgroundColor: info.bg }}
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
                        </div>
                      );
                    })
                  ) : (
                    <div className="mybets-empty">No results.</div>
                  )}
                </div>
              </div>

              <div className="betting-box betting-mybets">
                <h2 className="betting-title">MY BETS</h2>

                <div className="mybets-header grid grid-cols-4">
                  <span>Name</span>
                  <span>Odds</span>
                  <span>Stake</span>
                  <span>P/L</span>
                </div>

                {Array.isArray(userBets) && userBets.length > 0 ? (
                  userBets.slice(0, 8).map((bet: any, index: number) => (
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
