"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/match.css";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

type MatchOption = {
  id: string;
  name: string;
};

type BetPopupData = {
  matchId: string;
  name: string;
  odds: number;
  type: "back" | "lay" | "yes" | "no";
  isFancy: boolean;
  selectionId?: number;
  marketType?: string;
  marketId?: string;
  priceValue?: number;
};

const SAMPLE_MATCHES: MatchOption[] = [
  { id: "35353513", name: "ECL v LIM" },
  { id: "35353514", name: "IND v AUS" },
  { id: "35353515", name: "ENG v NZ" },
];

const SAMPLE_BOOKMAKER = [
  { sid: 101, mid: "BMK-101", t: "Bookmaker", nation: "Limpopo", b1: 833, l1: 842, bs1: 120000, ls1: 100000 },
  { sid: 102, mid: "BMK-102", t: "Bookmaker", nation: "ECL", b1: 794, l1: 805, bs1: 110000, ls1: 100000 },
];

const SAMPLE_TOSS = [
  { sid: 201, mid: "TOSS-201", t: "TOSS", nation: "Limpopo Toss", b1: 198, l1: 203, bs1: 50000, ls1: 50000 },
  { sid: 202, mid: "TOSS-202", t: "TOSS", nation: "ECL Toss", b1: 197, l1: 204, bs1: 50000, ls1: 50000 },
];

const SAMPLE_FANCY = [
  { sid: 301, mid: "FAN-301", srno: 1, nation: "10 over run ECL", b1: 63, l1: 62, bs1: 100, ls1: 110 },
  { sid: 302, mid: "FAN-302", srno: 2, nation: "8 over run ECL", b1: 50, l1: 49, bs1: 90, ls1: 100 },
  { sid: 303, mid: "FAN-303", srno: 3, nation: "Total 1st inning 150", b1: 52, l1: 53, bs1: 120, ls1: 120 },
];

const SAMPLE_FANCY_BOOK: Record<number, Array<{ odds: number; pnl: number }>> = {
  301: [
    { odds: 58, pnl: -1200 },
    { odds: 60, pnl: -600 },
    { odds: 62, pnl: 200 },
    { odds: 64, pnl: 850 },
    { odds: 66, pnl: 1250 },
  ],
  302: [
    { odds: 45, pnl: -900 },
    { odds: 47, pnl: -300 },
    { odds: 50, pnl: 450 },
    { odds: 52, pnl: 900 },
  ],
  303: [
    { odds: 145, pnl: -1000 },
    { odds: 148, pnl: -350 },
    { odds: 150, pnl: 200 },
    { odds: 153, pnl: 1100 },
  ],
};

const SAMPLE_BET_LIST = [
  { name: "Limpopo", odds: 8.33, stake: 5000, isBack: true, isFancy: false, marketName: "BOOKMAKER", placeTime: "13 Mar 3:10:22 PM" },
  { name: "ECL", odds: 8.05, stake: 3500, isBack: false, isFancy: false, marketName: "BOOKMAKER", placeTime: "13 Mar 3:11:09 PM" },
  { name: "Limpopo Toss", odds: 2.01, stake: 1200, isBack: true, isFancy: false, marketName: "TOSS", placeTime: "13 Mar 3:12:45 PM" },
  { name: "10 over run ECL", odds: 62, stake: 1500, isBack: false, isFancy: true, marketName: "Fancy2", placeTime: "13 Mar 3:13:16 PM" },
  { name: "8 over run ECL", odds: 50, stake: 2000, isBack: true, isFancy: true, marketName: "Fancy2", placeTime: "13 Mar 3:14:05 PM" },
];

const SAMPLE_COMPLETED = [
  { name: "Limpopo", odds: 8.10, stake: 1000, isBack: true, isFancy: false, marketName: "BOOKMAKER", declared: "WON", netPnl: 7100 },
  { name: "ECL Toss", odds: 2.00, stake: 2000, isBack: false, isFancy: false, marketName: "TOSS", declared: "LOST", netPnl: -2000 },
  { name: "Total 1st inning 150", odds: 52, stake: 1200, isBack: true, isFancy: true, marketName: "Fancy2", declared: "YES", netPnl: 1800 },
];

const SAMPLE_STAKES = [500, 1000, 2000, 3000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 300000];

export default function TestPage() {
  const [selectedId, setSelectedId] = useState(SAMPLE_MATCHES[0].id);
  const [favorite, setFavorite] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLiveTV, setShowLiveTV] = useState(false);
  const [activeBetTab, setActiveBetTab] = useState("bookmaker");
  const [showSessionBookModal, setShowSessionBookModal] = useState(false);
  const [selectedFancyName, setSelectedFancyName] = useState("");
  const [fancyBookRows, setFancyBookRows] = useState<Array<{ odds: number; pnl: number }>>([]);

  const [showBetPopup, setShowBetPopup] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetPopupData | null>(null);
  const [quickAmounts] = useState<number[]>(SAMPLE_STAKES);
  const [stake, setStake] = useState<number>(0);
  const [countdown, setCountdown] = useState(7);
  const [placingBet, setPlacingBet] = useState(false);

  const selectedMatch =
    SAMPLE_MATCHES.find((item) => item.id === selectedId) || SAMPLE_MATCHES[0];

  const sortedFancyData = useMemo(
    () => [...SAMPLE_FANCY].sort((a, b) => Number(a.srno) - Number(b.srno)),
    []
  );

  const bookmakerBets = SAMPLE_BET_LIST.filter(
    (bet) => !bet.isFancy && String(bet.marketName).toUpperCase() === "BOOKMAKER"
  );
  const tossBets = SAMPLE_BET_LIST.filter(
    (bet) => !bet.isFancy && String(bet.marketName).toUpperCase() === "TOSS"
  );
  const fancyBets = SAMPLE_BET_LIST.filter((bet) => bet.isFancy);

  const openBetPopup = (betData: Omit<BetPopupData, "matchId">) => {
    setSelectedBet({ ...betData, matchId: selectedId });
    setStake(0);
    setShowBetPopup(true);
  };

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

  const closeBetPopup = () => {
    setShowBetPopup(false);
    setSelectedBet(null);
    setStake(0);
    setCountdown(7);
  };

  const handlePlaceBet = async () => {
    if (!selectedBet) return;
    if (!stake || stake <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    setPlacingBet(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPlacingBet(false);
    toast.success(`Sample bet placed on ${selectedBet.name}`);
    closeBetPopup();
  };

  const handleBookClick = (fancy: any) => {
    setSelectedFancyName(fancy?.nation || "Session Book");
    setFancyBookRows(SAMPLE_FANCY_BOOK[Number(fancy?.sid)] || []);
    setShowSessionBookModal(true);
  };

  const closeSessionBookModal = () => {
    setShowSessionBookModal(false);
    setSelectedFancyName("");
    setFancyBookRows([]);
  };

  const scoreSrc = `https://score.newbsf.com/#/score7/${selectedMatch.id}`;
  const tvSrc = `https://livetv.apnatv.shop/livetv.php?eventId=${selectedMatch.id}`;

  const placedBetsContent = (
    <>
      <div className="betSlipBox">
        <div className="betslip-head">
          <span id="tital_change" className="item">Bet Slip</span>
          <a>Placed Bets</a>
        </div>

        <div className="tab_bets">
          <ul id="pills-tab" role="tablist" className="nav nav-tabs nav-pills mb-3">
            <li className="nav-item betdata active-all" style={{ background: "#0b7d36" }}>
              <a className="allbet active" style={{ padding: "9px 15px", color: "#fff", border: "none" }} onClick={(e) => { e.preventDefault(); setActiveBetTab("bookmaker"); }}>
                <span className="bet-label">Bookmaker</span>
                <span id="matchBetsCount">({bookmakerBets.length})</span>
              </a>
            </li>

            <li className="nav-item betdata" style={{ background: "#417e92" }}>
              <a className="unmatchbet" style={{ padding: "9px 15px", color: "#fff", border: "none" }} onClick={(e) => { e.preventDefault(); setActiveBetTab("toss"); }}>
                <span className="bet-label">Toss</span>
                <span id="fancyBetsCount">({tossBets.length})</span>
              </a>
            </li>

            <li className="nav-item betdata" style={{ background: "darkred" }}>
              <a className="unmatchbet" style={{ padding: "9px 5px", color: "#fff", border: "none" }} onClick={(e) => { e.preventDefault(); setActiveBetTab("fancy"); }}>
                <span className="bet-label">Fancy</span>
                <span id="fancyBetsCount">({fancyBets.length})</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div id="MatchUnMatchBetaData">
        <div id="maindivbets" className="tab-content">
          {activeBetTab === "bookmaker" && (
            <div id="allbetss" className="match_bets MachShowHide tab-pane fade in active">
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
                <tbody id="matchBets">
                  {bookmakerBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{(Number(b?.odds || 0)).toFixed(2)}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "Lagai" : "Khai"}</td>
                      <td>{b?.placeTime || "-"}</td>
                      <td>{b?.marketName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeBetTab === "toss" && (
            <div id="fbets" className="match_bets MachShowHide tab-pane fade">
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
                  {tossBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{(Number(b?.odds || 0)).toFixed(2)}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "Lagai" : "Khai"}</td>
                      <td>{b?.placeTime || "-"}</td>
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
                  {fancyBets.map((b: any, idx: number) => (
                    <tr key={`${b?.name}-${idx}`} className="content_user_table mark-back">
                      <td>{idx + 1}</td>
                      <td>{b?.name || "-"}</td>
                      <td>{(Number(b?.odds || 0)).toFixed(2)}</td>
                      <td>{Number(b?.stake || 0).toFixed(2)}</td>
                      <td>{b?.isBack ? "YES" : "NO"}</td>
                      <td>{b?.placeTime || "-"}</td>
                      <td>{b?.marketName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="completed-table-wrap">
        <div className="completed-table-head">Completed Bets</div>
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
            {SAMPLE_COMPLETED.map((b: any, idx: number) => (
              <tr key={`${b?.name}-${idx}`}>
                <td>{idx + 1}</td>
                <td>{b?.name || "-"}</td>
                <td>{(Number(b?.odds || 0)).toFixed(2)}</td>
                <td>{Number(b?.stake || 0).toFixed(2)}</td>
                <td>{b?.isFancy ? (b?.isBack ? "YES" : "NO") : (b?.isBack ? "Lagai" : "Khai")}</td>
                <td>{b?.declared || "-"}</td>
                <td>{Number(b?.netPnl || 0).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

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
                            {selectedMatch.name}
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
                                {SAMPLE_MATCHES.map((item) => (
                                  <li key={item.id} className="match-dd-item">
                                    <a
                                      className="match-dd-link"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedId(item.id);
                                        setDropdownOpen(false);
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

                <div id="bookMakerDiv" className="sportrow-4 matchOpenBox_214087">
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

                        {SAMPLE_BOOKMAKER.map((bm: any) => (
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
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="sportrow-4 matchOpenBox_214087">
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

                        {SAMPLE_TOSS.map((row: any) => (
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
                </div>

                <div className="sportrow-4 autoFancyDiv">
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
                              <p className="runner_text">{row?.nation || "-"}</p>
                              <a onClick={() => handleBookClick(row)}>
                                <img src="/assets/images/ladder.svg" style={{ width: "7%" }} />
                              </a>
                              <i className="fa fa-info-circle fancy-info"></i>
                              <button className="fancy-book-btn" onClick={() => handleBookClick(row)}>
                                Book
                              </button>
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
                </div>

                <div className="test-mobile-bets">
                  {placedBetsContent}
                </div>
              </section>

              <aside className="match-right-panel test-desktop-bets">
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
                  {fancyBookRows.length === 0 ? (
                    <tr><td colSpan={2} className="text-center">No Data Found</td></tr>
                  ) : fancyBookRows.map((item: any, idx: number) => (
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
              {quickAmounts.map((amount, idx) => (
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
