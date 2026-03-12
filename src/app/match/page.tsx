"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { fetchMatches } from "../../store/actions/matches";
import { fetchGameData, clearGameData } from "../../store/actions/game";
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

export default function MatchPage({ initialMatchId }: MatchPageProps) {
  const router = useRouter();
  const { list: matches } = useSelector((state: RootState) => state.matches);
  const { bookmaker, fancy2, loading } = useSelector((state: RootState) => state.game);
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

  useEffect(() => {
    setIsHydrated(true);
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

  const selectedMatch =
    options.find((item) => item.id === selectedId) ||
    options[0] || { id: "", name: "No match available" };

  const bookmakerData = isHydrated && Array.isArray(bookmaker)
    ? bookmaker.filter((item: any) => item?.t === "Bookmaker")
    : [];

  const tossData = isHydrated && Array.isArray(bookmaker)
    ? bookmaker.filter((item: any) => item?.t === "TOSS")
    : [];

  const sortedFancyData = isHydrated && Array.isArray(fancy2)
    ? [...fancy2].sort((a: any, b: any) => Number(a?.srno || 0) - Number(b?.srno || 0))
    : [];

  const bookmakerBets = (isHydrated ? betList : []).filter(
    (bet: any) => !bet.isFancy && String(bet.marketName || "").toUpperCase() === "BOOKMAKER"
  );
  const tossBets = (isHydrated ? betList : []).filter(
    (bet: any) => !bet.isFancy && String(bet.marketName || "").toUpperCase() === "TOSS"
  );
  const fancyBets = (isHydrated ? betList : []).filter((bet: any) => bet.isFancy);
  const completedBetsData = isHydrated ? completedBets : [];

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

                        {loading && bookmakerData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="match-empty-cell">Loading bookmaker odds...</td>
                          </tr>
                        ) : bookmakerData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="match-empty-cell">No bookmaker odds available</td>
                          </tr>
                        ) : bookmakerData.map((bm: any) => (
                          <tr key={`${bm?.sid}-${bm?.nation}`} className="back_lay_color runner-row-1 ball_running-message">
                            <td>
                              <p className="runner_text">{bm?.nation || "-"}</p>
                            </td>
                            <td className="mark-back">
                              <a style={{ color: "inherit" }}>
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{bm?.b1 ?? "-"}</span>
                              </a>
                            </td>
                            <td className="mark-lay">
                              <a style={{ color: "inherit" }}>
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

                        {tossData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="match-empty-cell">No toss odds available</td>
                          </tr>
                        ) : tossData.map((row: any) => (
                          <tr key={`${row?.sid}-${row?.nation}`} className="back_lay_color runner-row-1 ball_running-message">
                            <td>
                              <p className="runner_text">{row?.nation || "-"}</p>
                            </td>
                            <td className="mark-back">
                              <a style={{ color: "inherit" }}>
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{row?.b1 ?? "-"}</span>
                              </a>
                            </td>
                            <td className="mark-lay">
                              <a style={{ color: "inherit" }}>
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

                        {sortedFancyData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="match-empty-cell">No fancy odds available</td>
                          </tr>
                        ) : sortedFancyData.map((row: any) => (
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
                              <span className="session-price">{row?.l1 ?? 0}</span>
                              <span className="session-size">{row?.ls1 ?? 0}</span>
                            </td>
                            <td className="mark-back session-back-cell">
                              <span className="session-price">{row?.b1 ?? 0}</span>
                              <span className="session-size">{row?.bs1 ?? 0}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <aside className="match-right-panel">
                <div className="betSlipBox">
                  <div className="betslip-head">
                    <span id="tital_change" className="item">Bet Slip</span>
                    <a>Placed Bets</a>
                  </div>

                  <div className="tab_bets">
                    <ul id="pills-tab" role="tablist" className="nav nav-tabs nav-pills mb-3">
                      <li className="nav-item betdata active-all" style={{ background: "#0b7d36" }}>
                        <a
                          className="allbet active"
                          style={{ padding: "9px 15px", color: "#fff", border: "none" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveBetTab("bookmaker");
                          }}
                        >
                          <span className="bet-label">Bookmaker</span>
                          <span id="matchBetsCount">({bookmakerBets.length})</span>
                        </a>
                      </li>

                      <li className="nav-item betdata" style={{ background: "#417e92" }}>
                        <a
                          className="unmatchbet"
                          style={{ padding: "9px 15px", color: "#fff", border: "none" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveBetTab("toss");
                          }}
                        >
                          <span className="bet-label">Toss</span>
                          <span id="fancyBetsCount">({tossBets.length})</span>
                        </a>
                      </li>

                      <li className="nav-item betdata" style={{ background: "darkred" }}>
                        <a
                          className="unmatchbet"
                          style={{ padding: "9px 5px", color: "#fff", border: "none" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveBetTab("fancy");
                          }}
                        >
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
                            {loadingBetList && bookmakerBets.length === 0 ? (
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
                      {loadingCompletedBets && completedBetsData.length === 0 ? (
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
    </div>
  );
}
