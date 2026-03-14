"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "../../store/store";
import { fetchMatches } from "../../store/actions/matches";
import { fetchGameData, clearGameData } from "../../store/actions/game";
import { placeBet, resetBetState } from "../../store/actions/bet";
import {
  fetchMatchBetsData,
  fetchFancyBook,
  clearFancyBook,
  fetchCompletedBets,
} from "../../store/actions/matchBets";
import "../../styles/match.css";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

type MatchPageProps = {
  initialMatchId?: string;
};

type MatchOption = {
  id: string;
  name: string;
};

type SelectedBet = {
  matchId: string;
  name: string;
  odds: number;
  type: "back" | "lay" | "yes" | "no";
  isFancy: boolean;
  selectionId?: number;
  marketType?: string;
  marketId?: string;
  priceValue?: number;
  userIp?: string;
};

export default function MatchPage({ initialMatchId }: MatchPageProps) {
  const router = useRouter();
  const { list: matches } = useSelector((state: RootState) => state.matches);
  const { bookmaker, fancy2, loading } = useSelector((state: RootState) => state.game);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const { placingBet, betSuccess } = useSelector((state: RootState) => state.bet as any);
  const {
    betList,
    completedBets,
    fancyBook,
    loadingFancyBook,
    loadingBetList,
    loadingCompletedBets,
  } = useSelector((state: RootState) => state.matchBets);

  const options: MatchOption[] = useMemo(
    () =>
      (matches || []).map((m: any) => ({
        id: String(m?.matchId ?? ""),
        name: m?.matchName || "-",
      })),
    [matches]
  );

  const [selectedId, setSelectedId] = useState(initialMatchId || "");
  const [favorite, setFavorite] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLiveTV, setShowLiveTV] = useState(false);
  const [activeBetTab, setActiveBetTab] = useState("bookmaker");
  const [showSessionBookModal, setShowSessionBookModal] = useState(false);
  const [selectedFancyName, setSelectedFancyName] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [showBetPopup, setShowBetPopup] = useState(false);
  const [selectedBet, setSelectedBet] = useState<SelectedBet | null>(null);
  const [quickAmounts, setQuickAmounts] = useState<number[]>([]);
  const [loadingStakes, setLoadingStakes] = useState(false);
  const [isBetTablesOpen, setIsBetTablesOpen] = useState(true);
  const [activeFancyInfoId, setActiveFancyInfoId] = useState<string | null>(null);
  const [stake, setStake] = useState<number>(0);
  const [countdown, setCountdown] = useState(7);
  const [userIp, setUserIp] = useState("0.0.0.0");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        if (data?.ip) {
          setUserIp(data.ip);
        }
      } catch (_error) {
        setUserIp("0.0.0.0");
      }
    };
    fetchIp();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (!options.length) return;

    if (initialMatchId && options.some((o) => o.id === initialMatchId)) {
      setSelectedId(initialMatchId);
      return;
    }

    if (!selectedId || !options.some((o) => o.id === selectedId)) {
      setSelectedId(options[0].id);
    }
  }, [initialMatchId, options, selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    fetchGameData(selectedId, false);
    fetchMatchBetsData(selectedId);
    fetchCompletedBets(selectedId);

    const interval = setInterval(() => {
      fetchGameData(selectedId, true);
      fetchMatchBetsData(selectedId);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearFancyBook();
      clearGameData();
    };
  }, [selectedId]);

  useEffect(() => {
    if (!betSuccess) return;

    setShowBetPopup(false);
    setSelectedBet(null);
    setStake(0);
    setCountdown(7);
    fetchMatchBetsData(selectedId);
    fetchCompletedBets(selectedId);

    const timer = setTimeout(() => {
      resetBetState();
    }, 1200);

    return () => clearTimeout(timer);
  }, [betSuccess, selectedId]);

  useEffect(() => {
    if (!showBetPopup) return;

    setCountdown(7);
    const autoCloseTimer = setTimeout(() => {
      setShowBetPopup(false);
      setSelectedBet(null);
      setStake(0);
      setCountdown(7);
    }, 7000);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [showBetPopup]);

  // Keep server and first client render identical by only using dynamic match options after hydration.
  const hydratedOptions = isHydrated ? options : [];
  const selectedMatch =
    hydratedOptions.find((item) => item.id === selectedId) ||
    hydratedOptions[0] || { id: "", name: "No match available" };

  const bookmakerData = isHydrated && Array.isArray(bookmaker)
    ? bookmaker.filter((item: any) => item?.t === "Bookmaker")
    : [];

  const tossData = isHydrated && Array.isArray(bookmaker)
    ? bookmaker.filter((item: any) => item?.t === "TOSS")
    : [];

  const sortedFancyData = isHydrated && Array.isArray(fancy2)
    ? [...fancy2].sort((a: any, b: any) => Number(a?.srno || 0) - Number(b?.srno || 0))
    : [];

  const hasBookmakerData = bookmakerData.length > 0;
  const hasTossData = tossData.length > 0;
  const hasFancyData = sortedFancyData.length > 0;

  const bookmakerBets = (isHydrated ? betList : []).filter(
    (bet: any) => !bet.isFancy && String(bet.marketName || "").toUpperCase() === "BOOKMAKER"
  );
  const tossBets = (isHydrated ? betList : []).filter(
    (bet: any) => !bet.isFancy && String(bet.marketName || "").toUpperCase() === "TOSS"
  );
  const fancyBets = (isHydrated ? betList : []).filter((bet: any) => bet.isFancy);
  const completedBetsData = isHydrated ? completedBets : [];
  const isLoadingBetList = isHydrated ? loadingBetList : false;
  const isLoadingCompletedBets = isHydrated ? loadingCompletedBets : false;

  const openMatch = (matchId: string) => {
    setSelectedId(matchId);
    setDropdownOpen(false);
    router.push(`/match/${matchId}`);
  };

  const handleBookClick = async (fancy: any) => {
    setSelectedFancyName(fancy?.nation || "Session Book");
    setShowSessionBookModal(true);
    await fetchFancyBook(fancy?.sid, selectedId);
  };

  const closeSessionBookModal = () => {
    setShowSessionBookModal(false);
    setSelectedFancyName("");
    clearFancyBook();
  };

  const closeBetPopup = () => {
    setShowBetPopup(false);
    setSelectedBet(null);
    setStake(0);
    setCountdown(7);
  };

  const fetchStakeButtons = async () => {
    if (!user?.userId || !accessToken) {
      setQuickAmounts([500, 1000, 2000, 3000, 5000, 10000, 20000, 25000, 50000, 100000]);
      return;
    }

    setLoadingStakes(true);
    try {
      const response = await axios.post(
        "/enduser/get-stake-button",
        { userId: user.userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status && response?.data?.data) {
        const d = response.data.data;
        const buttons = [
          d.stack1,
          d.stack2,
          d.stack3,
          d.stack4,
          d.stack5,
          d.stack6,
          d.stack7,
          d.stack8,
          d.stack9,
          d.stack10,
          d.stack11,
          d.stack12,
        ].filter((n: any) => n != null && Number(n) > 0);

        setQuickAmounts(buttons.length ? buttons : [500, 1000, 2000, 3000, 5000, 10000, 20000, 25000, 50000, 100000]);
      }
    } catch (_error) {
      setQuickAmounts([500, 1000, 2000, 3000, 5000, 10000, 20000, 25000, 50000, 100000]);
    } finally {
      setLoadingStakes(false);
    }
  };

  const openBetPopup = async (betData: Omit<SelectedBet, "matchId" | "userIp">) => {
    const enriched = {
      ...betData,
      matchId: selectedId,
      userIp,
    };

    setSelectedBet(enriched);
    setStake(0);
    setShowBetPopup(true);
    await fetchStakeButtons();
  };

  const handlePlaceBet = async () => {
    if (!selectedBet) return;

    if (!stake || stake <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    const result = await placeBet({
      ...selectedBet,
      stake,
    });

    if (!result?.success && result?.error) {
      toast.error(result.error);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day} ${month} ${hour12}:${minutes}:${seconds} ${ampm}`;
  };

  const placedBetsContent = (
    <>
      <div className="betSlipBox">
        <div className="betslip-head">
          <span className="item">Bet Slip</span>
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/edit-stake");
            }}
          >
            Edit Stake
          </a>
        </div>

        <div className="tab_bets">
          <ul role="tablist" className="nav nav-tabs nav-pills mb-3">
            <li className={`nav-item betdata active-all ${activeBetTab === "bookmaker" ? "active" : ""}`} style={{ background: "#0b7d36" }}>
              <a
                className={`allbet ${activeBetTab === "bookmaker" ? "active" : ""}`}
                style={{ padding: "9px 15px", color: "#fff", border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveBetTab("bookmaker");
                }}
              >
                <span className="bet-label">Matched Bet</span>
                <span>({bookmakerBets.length})</span>
              </a>
            </li>

            <li className={`nav-item betdata ${activeBetTab === "toss" ? "active" : ""}`} style={{ background: "#417e92" }}>
              <a
                className={`unmatchbet ${activeBetTab === "toss" ? "active" : ""}`}
                style={{ padding: "9px 15px", color: "#fff", border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveBetTab("toss");
                }}
              >
                <span className="bet-label">Toss Bet</span>
                <span>({tossBets.length})</span>
              </a>
            </li>

            <li className={`nav-item betdata ${activeBetTab === "fancy" ? "active" : ""}`} style={{ background: "darkred" }}>
              <a
                className={`unmatchbet ${activeBetTab === "fancy" ? "active" : ""}`}
                style={{ padding: "9px 5px", color: "#fff", border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveBetTab("fancy");
                }}
              >
                <span className="bet-label">Fancy Bet</span>
                <span>({fancyBets.length})</span>
              </a>
            </li>

            <li className={`nav-item betdata ${activeBetTab === "completed" ? "active" : ""}`} style={{ background: "#5b4f9a" }}>
              <a
                className={`unmatchbet ${activeBetTab === "completed" ? "active" : ""}`}
                style={{ padding: "9px 5px", color: "#fff", border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveBetTab("completed");
                }}
              >
                <span className="bet-label">Completed Fancy</span>
                <span>({completedBetsData.length})</span>
              </a>
            </li>

            <li className="nav-item active-position">
              <a
                id="togdiv"
                onClick={(e) => {
                  e.preventDefault();
                  setIsBetTablesOpen((prev) => !prev);
                }}
              >
                <span>
                  &nbsp;
                  <i className={`fa ${isBetTablesOpen ? "fa-caret-down" : "fa-caret-up"}`}></i>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {isBetTablesOpen && <div className="match-bets-scroll-wrap">
        <div className="tab-content">
          {activeBetTab === "bookmaker" && (
            <div className="match_bets MachShowHide tab-pane fade in active">
              <table className="table table-striped jambo_table bulk_action wspace">
                <thead>
                  <tr className="headings">
                    <td style={{ width: "4%" }}>No.</td>
                    <td style={{ width: "18%" }}>Runner</td>
                    <td style={{ width: "6%" }}>Odds</td>
                    <td style={{ width: "10%" }}>Stack</td>
                    <td style={{ width: "8%" }}>Bet Type</td>
                    <td style={{ width: "21%" }}>Place Time</td>
                    <td>Market</td>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingBetList && bookmakerBets.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">Loading bets...</td></tr>
                  ) : bookmakerBets.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">No bookmaker bets found</td></tr>
                  ) : bookmakerBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{((Number(b?.odds || 0) * 100).toFixed(2))}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "Lagai" : "Khai"}</td>
                      <td>{formatDate(b?.placeTime)}</td>
                      <td>{b?.marketName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeBetTab === "toss" && (
            <div className="match_bets MachShowHide tab-pane fade">
              <table className="table table-striped jambo_table bulk_action wspace">
                <thead>
                  <tr className="headings">
                    <td style={{ width: "4%" }}>No.</td>
                    <td style={{ width: "18%" }}>Runner</td>
                    <td style={{ width: "8%" }}>Odds</td>
                    <td style={{ width: "8%" }}>Stack</td>
                    <td style={{ width: "8%" }}>Bet Type</td>
                    <td style={{ width: "21%" }}>Place Time</td>
                    <td>Market</td>
                  </tr>
                </thead>
                <tbody>
                  {tossBets.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">No toss bets found</td></tr>
                  ) : tossBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{((Number(b?.odds || 0) * 100).toFixed(2))}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "Lagai" : "Khai"}</td>
                      <td>{formatDate(b?.placeTime)}</td>
                      <td>{b?.marketName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeBetTab === "fancy" && (
            <div className="match_bets MachShowHide tab-pane fade">
              <table className="table table-striped jambo_table bulk_action wspace">
                <thead>
                  <tr className="headings">
                    <td style={{ width: "4%" }}>No.</td>
                    <td style={{ width: "18%" }}>Runner</td>
                    <td style={{ width: "8%" }}>Odds</td>
                    <td style={{ width: "8%" }}>Stack</td>
                    <td style={{ width: "8%" }}>Mode</td>
                    <td style={{ width: "21%" }}>Place Time</td>
                    <td>Market</td>
                  </tr>
                </thead>
                <tbody>
                  {fancyBets.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">No fancy bets found</td></tr>
                  ) : fancyBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{((Number(b?.odds || 0) * 100).toFixed(2))}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "YES" : "NO"}</td>
                      <td>{formatDate(b?.placeTime)}</td>
                      <td>{b?.marketName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeBetTab === "completed" && (
            <div className="match_bets MachShowHide tab-pane fade">
              <table className="table table-striped jambo_table bulk_action wspace">
                <thead>
                  <tr className="headings">
                    <td style={{ width: "4%" }}>No.</td>
                    <td style={{ width: "18%" }}>Runner</td>
                    <td style={{ width: "8%" }}>Odds</td>
                    <td style={{ width: "8%" }}>Stack</td>
                    <td style={{ width: "8%" }}>Mode</td>
                    <td style={{ width: "21%" }}>Result</td>
                    <td>P&L</td>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingCompletedBets && completedBetsData.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">Loading completed bets...</td></tr>
                  ) : completedBetsData.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">No completed bets found</td></tr>
                  ) : completedBetsData.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`}>
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{((Number(b?.odds || 0) * 100).toFixed(2))}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isFancy ? (b?.isBack ? "YES" : "NO") : (b?.isBack ? "Lagai" : "Khai")}</td>
                      <td>{b?.declared || "-"}</td>
                      <td>{Number(b?.netPnl || 0).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>}
    </>
  );

  const scoreSrc = selectedMatch.id
    ? `https://score.newbsf.com/#/score7/${selectedMatch.id}`
    : "about:blank";

  const tvSrc = selectedMatch.id
    ? `https://livetv.apnatv.shop/livetv.php?eventId=${selectedMatch.id}`
    : "about:blank";

  const title = selectedMatch.name;

  return (
    <div className="dashboard-wrapper">
      <HeaderDesktop />

      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">
          <SidebarDesktop />

          <main className="desktop-main commission-wrap">
            <div className="match-layout">
              <section className="match-left-panel">
                <div className="match-score-box">
                  <table className="match-top-table">
                    <tbody>
                      <tr className="mobile_heading">
                        <th className="match-name-head">
                          <span className="match-name-inline">
                            <i
                              className={`fa ${favorite ? "fa-star" : "fa-star-o"}`}
                              onClick={() => setFavorite((s) => !s)}
                              aria-hidden="true"
                            ></i>
                            {title}
                          </span>
                        </th>

                        <th className="match-tv-head">
                          <span className="click-tv" onClick={() => setShowLiveTV((s) => !s)}>
                            <span className="tvformobile">Live TV</span>
                          </span>
                        </th>

                        <th className="match-dropdown-head">
                          <div className="dropdown">
                            <button
                              type="button"
                              className="match-dropdown-button"
                              onClick={() => setDropdownOpen((s) => !s)}
                            >
                              Matches
                            </button>
                            {dropdownOpen && (
                              <ul id="matchesList" className="match-dd">
                                {options.map((item) => (
                                  <li key={item.id} className="match-dd-item">
                                    <a
                                      className="match-dd-link"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openMatch(item.id);
                                      }}
                                    >
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </th>
                      </tr>
                    </tbody>
                  </table>

                  <div className="score_area">
                    <iframe id="animscore" width="100%" title="Match Score" className="iframestyle" style={{ display: "none" }}></iframe>
                    <iframe
                      id="cricketScore"
                      title="Match Score"
                      className="iframestyle iframeheightControll"
                      style={{ width: "100%", background: "#000" }}
                      src={scoreSrc}
                    ></iframe>

                    {showLiveTV && (
                      <div className="tvformobilediv">
                        <iframe id="tvFrame" style={{ width: "100%", height: "250px" }} src={tvSrc}></iframe>
                      </div>
                    )}
                  </div>
                </div>

                {(loading || hasBookmakerData) && <div id="bookMakerDiv" className="sportrow-4 matchOpenBox_214087">
                  <div className="fullrow MatchIndentB">
                    <table className="table table-striped bulk_actions matchTable214087">
                      <tbody>
                        <tr className="headings mobile_heading">
                          <th className="fix_heading bookmaker-title">
                            Bookmaker <span className="minmax">Min/Max - 100 / 100000</span>
                          </th>
                          <th className="back_heading_color">Lagai</th>
                          <th className="lay_heading_color">Khai</th>
                        </tr>

                        {loading && bookmakerData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="match-empty-cell">Loading bookmaker odds...</td>
                          </tr>
                        ) : bookmakerData.map((bm: any) => (
                          <tr key={`${bm?.sid}-${bm?.nation}`} className="back_lay_color runner-row-1 ball_running-message">
                            <td>
                              <p className="runner_text">{bm?.nation || "-"}</p>
                            </td>
                            <td className="mark-back">
                              <a
                                style={{ color: "inherit" }}
                                onClick={() =>
                                  openBetPopup({
                                    name: bm?.nation || "-",
                                    odds: Number(bm?.b1 || 0),
                                    type: "back",
                                    isFancy: false,
                                    selectionId: Number(bm?.sid || 0),
                                    marketType: "Bookmaker",
                                    marketId: String(bm?.mid || ""),
                                  })
                                }
                              >
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{bm?.b1 ?? "-"}</span>
                              </a>
                            </td>
                            <td className="mark-lay">
                              <a
                                style={{ color: "inherit" }}
                                onClick={() =>
                                  openBetPopup({
                                    name: bm?.nation || "-",
                                    odds: Number(bm?.l1 || 0),
                                    type: "lay",
                                    isFancy: false,
                                    selectionId: Number(bm?.sid || 0),
                                    marketType: "Bookmaker",
                                    marketId: String(bm?.mid || ""),
                                  })
                                }
                              >
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{bm?.l1 ?? "-"}</span>
                              </a>
                            </td>
                          </tr>
                        ))}

                        <tr style={{ border: "0.5px solid #000" }}>
                          <td colSpan={3} className="modal_book_design" style={{ display: "none" }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>}

                {hasTossData && <div className="sportrow-4 matchOpenBox_214087">
                  <div className="fullrow MatchIndentB">
                    <table className="table table-striped bulk_actions matchTable214087">
                      <tbody>
                        <tr className="headings mobile_heading">
                          <th className="fix_heading bookmaker-title">
                            Toss Odds <span className="minmax">Min/Max - 100 / 100000</span>
                          </th>
                          <th className="back_heading_color">Lagai</th>
                          <th className="lay_heading_color">Khai</th>
                        </tr>

                        {tossData.map((row: any) => (
                          <tr key={`${row?.sid}-${row?.nation}`} className="back_lay_color runner-row-1 ball_running-message">
                            <td>
                              <p className="runner_text">{row?.nation || "-"}</p>
                            </td>
                            <td className="mark-back">
                              <a
                                style={{ color: "inherit" }}
                                onClick={() =>
                                  openBetPopup({
                                    name: row?.nation || "-",
                                    odds: Number(row?.b1 || 0),
                                    type: "back",
                                    isFancy: false,
                                    selectionId: Number(row?.sid || 0),
                                    marketType: "TOSS",
                                    marketId: String(row?.mid || ""),
                                  })
                                }
                              >
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{row?.b1 ?? "-"}</span>
                              </a>
                            </td>
                            <td className="mark-lay">
                              <a
                                style={{ color: "inherit" }}
                                onClick={() =>
                                  openBetPopup({
                                    name: row?.nation || "-",
                                    odds: Number(row?.l1 || 0),
                                    type: "lay",
                                    isFancy: false,
                                    selectionId: Number(row?.sid || 0),
                                    marketType: "TOSS",
                                    marketId: String(row?.mid || ""),
                                  })
                                }
                              >
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{row?.l1 ?? "-"}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>}

                {hasFancyData && <div className="sportrow-4 autoFancyDiv">
                  <div className="fullrow MatchIndentB">
                    <table className="table table-striped bulk_actions">
                      <tbody id="fancy_table_own">
                        <tr className="headings mobile_heading">
                          <th className="fix_heading session-title">Session</th>
                          <th className="lay_heading_color session-no">No</th>
                          <th className="back_heading_color session-yes">Yes</th>
                        </tr>

                        {sortedFancyData.map((row: any) => (
                          <tr key={`${row?.sid}-${row?.nation}`} className="back_lay_color ball_running-message">
                            <td>
                              {(() => {
                                const fancyInfoId = String(row?.sid || row?.mid || row?.nation || "");
                                const minStake = Number(row?.minBet || 0);
                                const maxStake = Number(row?.maxBet || 0);

                                return (
                              <div className="fancy-runner-inline">
                                <p className="runner_text">{row?.nation || "-"}</p>
                                <div className="fancy-runner-actions">
                                  <a onClick={() => handleBookClick(row)}>
                                    <img src="/assets/images/ladder.svg" className="fancy-ladder-icon" />
                                  </a>
                                  <div
                                    className="fancy-info-wrap"
                                    onMouseEnter={() => setActiveFancyInfoId(fancyInfoId)}
                                    onMouseLeave={() => {
                                      setActiveFancyInfoId((prev) => (prev === fancyInfoId ? null : prev));
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="fancy-info-btn"
                                      aria-label="Show minimum and maximum stake"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveFancyInfoId((prev) => (prev === fancyInfoId ? null : fancyInfoId));
                                      }}
                                    >
                                      <svg
                                        className="fancy-info-icon"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 4a1.25 1.25 0 110 2.5A1.25 1.25 0 0112 6zm1.25 12h-2.5a.75.75 0 010-1.5h.5v-4h-.5a.75.75 0 010-1.5H12a.75.75 0 01.75.75v4.75h.5a.75.75 0 010 1.5z"
                                        />
                                      </svg>
                                    </button>
                                    <div className={`fancy-minmax-tooltip ${activeFancyInfoId === fancyInfoId ? "show" : ""}`}>
                                      <div>Min stake: {minStake.toFixed(2)}</div>
                                      <div>Max stake: {maxStake.toFixed(2)}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                                );
                              })()}
                            </td>
                            <td className="mark-lay session-lay-cell">
                              <span
                                className="session-price"
                                onClick={() =>
                                  openBetPopup({
                                    name: row?.nation || "-",
                                    odds: Number(row?.l1 || 0),
                                    type: "no",
                                    isFancy: true,
                                    selectionId: Number(row?.sid || 0),
                                    marketType: "Fancy2",
                                    marketId: String(row?.mid || row?.sid || ""),
                                    priceValue: Number(row?.ls1 || 0),
                                  })
                                }
                              >
                                {row?.l1 ?? 0}
                              </span>
                              <span className="session-size">{row?.ls1 ?? 0}</span>
                            </td>
                            <td className="mark-back session-back-cell">
                              <span
                                className="session-price"
                                onClick={() =>
                                  openBetPopup({
                                    name: row?.nation || "-",
                                    odds: Number(row?.b1 || 0),
                                    type: "yes",
                                    isFancy: true,
                                    selectionId: Number(row?.sid || 0),
                                    marketType: "Fancy2",
                                    marketId: String(row?.mid || row?.sid || ""),
                                    priceValue: Number(row?.bs1 || 0),
                                  })
                                }
                              >
                                {row?.b1 ?? 0}
                              </span>
                              <span className="session-size">{row?.bs1 ?? 0}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>}

                <div className="match-mobile-bets">
                  {placedBetsContent}
                </div>
              </section>

              <aside className="match-right-panel match-desktop-bets">
                {placedBetsContent}
              </aside>
            </div>
          </main>
        </div>
      </div>

      {showSessionBookModal && (
        <div className="match-modal-overlay" onClick={closeSessionBookModal}>
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="match-modal-head">
              <h3>{selectedFancyName || "Session Book"}</h3>
              <button onClick={closeSessionBookModal}>x</button>
            </div>

            <div className="match-modal-body">
              <table className="table table-striped bulk_actions">
                <thead>
                  <tr className="headings">
                    <th>Run</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingFancyBook && fancyBook.length === 0 ? (
                    <tr><td colSpan={2} className="text-center">Loading...</td></tr>
                  ) : fancyBook.length === 0 ? (
                    <tr><td colSpan={2} className="text-center">No Data Found</td></tr>
                  ) : fancyBook.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>{item?.odds ?? "-"}</td>
                      <td className={Number(item?.pnl || 0) >= 0 ? "text-success" : "text-danger"}>
                        {Number(item?.pnl || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showBetPopup && selectedBet && (
        <div className="match-modal-overlay bet-placement-overlay" onClick={closeBetPopup}>
          <div className={`match-modal bet-modal ${selectedBet?.type === "back" || selectedBet?.type === "yes" ? "bet-modal-back" : "bet-modal-lay"}`} onClick={(e) => e.stopPropagation()}>
            <div className="bet-strip row">
              <div className="col-6" style={{ flex: 2 }}>
                <label>Team</label>
                <p>{selectedBet.name}</p>
              </div>
              <div className="col-3" style={{ flex: 1 }}>
                <label>Rate</label>
                <p>{selectedBet.odds}</p>
              </div>
              <div className="col-3" style={{ flex: 1 }}>
                <label>Mode</label>
                <p>{selectedBet.isFancy ? (selectedBet.type === "yes" ? "Y" : "N") : (selectedBet.type === "back" ? "L" : "K")}</p>
              </div>
            </div>

            <div className="bet-amount-grid">
              {(quickAmounts || []).map((amount, idx) => (
                <button key={`${amount}-${idx}`} type="button" className="bet-price-btn" onClick={() => setStake(Number(amount || 0))}>
                  {amount}
                </button>
              ))}
            </div>

            <div className="bet-input-wrap">
              <input
                placeholder="Amount"
                type="number"
                value={stake || ""}
                onChange={(e) => setStake(Number(e.target.value || 0))}
                className="bet-input"
              />
              <span className="bet-countdown">{countdown}</span>
            </div>

            {loadingStakes && <div className="bet-loading-text">Loading stake buttons...</div>}

            <div className="bet-footer-actions">
              <button type="button" className="bet-cancel-btn" onClick={closeBetPopup}>
                Cancel
              </button>
              <button
                type="button"
                className="bet-place-btn"
                onClick={handlePlaceBet}
                disabled={placingBet || !stake || stake <= 0}
              >
                {placingBet ? "Placing..." : "Placebet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
