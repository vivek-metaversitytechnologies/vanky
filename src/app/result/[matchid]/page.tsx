"use client";

import { useEffect, useMemo, useState } from "react";
import { urbApiClient } from "../../../config/axiosConfig";
import HeaderDesktop from "../../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../../components/Layout/SidebarDesktop";
import Marquee from "../../../components/Layout/Marquee";
import BackButton from "../../../components/Layout/BackButton";
import "../../../styles/result.css";

type ResultPageProps = {
  params: Promise<{ matchid: string }>;
};

type BetRow = {
  marketName: "BOOKMAKER" | "TOSS" | "FANCY";
  name: string;
  odds: number;
  stake: number;
  mode: string;
  declared: string;
  netPnl: number;
  priceValue: number;
};

const moneyText = (value: number) => {
  if (value > 0) return `You Won ${Math.abs(value).toFixed(0)}/- Coins`;
  if (value < 0) return `You Lost ${Math.abs(value).toFixed(0)}/- Coins`;
  return "You Won 0/- Coins";
};

export default function MatchResultPage({ params }: ResultPageProps) {
  const [matchId, setMatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BetRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const p = await params;
      if (!cancelled) {
        setMatchId(p?.matchid || "");
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!matchId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await urbApiClient.post("/enduser/bet-list-by-matchid", {
          matchId,
          activeBet: false,
        });

        const raw = response?.data?.data || {};
        const allRows: BetRow[] = [];

        if (Array.isArray(raw?.TOSS)) {
          allRows.push(
            ...raw.TOSS.map((bet: any) => ({
              marketName: "TOSS" as const,
              name: bet?.nation || "-",
              odds: Number(bet?.rate || 0),
              stake: Number(bet?.amount || 0),
              mode: bet?.back ? "LAGAI" : "KHAI",
              declared: bet?.declared || "",
              netPnl: Number(bet?.netPnl || 0),
              priceValue: Number(bet?.priveValue || 0),
            }))
          );
        }

        if (Array.isArray(raw?.Bookmaker)) {
          allRows.push(
            ...raw.Bookmaker.map((bet: any) => ({
              marketName: "BOOKMAKER" as const,
              name: bet?.nation || "-",
              odds: Number(bet?.rate || 0),
              stake: Number(bet?.amount || 0),
              mode: bet?.back ? "LAGAI" : "KHAI",
              declared: bet?.declared || "",
              netPnl: Number(bet?.netPnl || 0),
              priceValue: Number(bet?.priveValue || 0),
            }))
          );
        }

        if (Array.isArray(raw?.Fancy2Market)) {
          allRows.push(
            ...raw.Fancy2Market.map((bet: any) => ({
              marketName: "FANCY" as const,
              name: bet?.nation || "-",
              odds: Number(bet?.rate || 0),
              stake: Number(bet?.amount || 0),
              mode: bet?.back ? "Yes" : "No",
              declared: bet?.declared || "",
              netPnl: Number(bet?.netPnl || 0),
              priceValue: Number(bet?.priveValue || 0),
            }))
          );
        }

        if (!cancelled) {
          setRows(allRows);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || err?.message || "Unable to fetch result data"
          );
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const tossRows = useMemo(() => rows.filter((r) => r.marketName === "TOSS"), [rows]);
  const bookmakerRows = useMemo(() => rows.filter((r) => r.marketName === "BOOKMAKER"), [rows]);
  const fancyRows = useMemo(() => rows.filter((r) => r.marketName === "FANCY"), [rows]);

  const tossTotal = tossRows.reduce((sum, row) => sum + Number(row.netPnl || 0), 0);
  const matchTotal = bookmakerRows.reduce((sum, row) => sum + Number(row.netPnl || 0), 0);
  const fancyTotal = fancyRows.reduce((sum, row) => sum + Number(row.netPnl || 0), 0);
  const totalCommission = 0;
  const appCharges = 0;
  const netTotal = tossTotal + matchTotal + fancyTotal - totalCommission - appCharges;

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
            <div className="casino-heading no-radius uppercase acc-heading result-header">
              Match Result
              <BackButton />
            </div>

            <div id="sticky" className="main_container result-main">
              <div role="main" className="right_col">
                <div className="row">
                  <div className="col-xs-12 col-lg-12 result-col">
                    <div className="lagder1 result-card">
                      <div className="lagderp1 result-title">Match Toss Bets</div>
                      <div id="tossStatement" className="table-responsive">
                        <table className="table table-bordered header-top-spacing">
                          <thead>
                            <tr>
                              <th className="bet-place-tbl-th">Rate</th>
                              <th className="bet-place-tbl-th">Amt.</th>
                              <th className="bet-place-tbl-th">Mode</th>
                              <th className="bet-place-tbl-th">Team</th>
                              <th className="bet-place-tbl-th">Result</th>
                              <th className="bet-place-tbl-th">P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr><td colSpan={6} className="bet-place-tbl-td text-center">Loading...</td></tr>
                            ) : tossRows.length === 0 ? (
                              <tr><td colSpan={6} className="bet-place-tbl-td text-center">No toss bets found</td></tr>
                            ) : tossRows.map((row, idx) => (
                              <tr key={`toss-${idx}`}>
                                <td className="bet-place-tbl-td">{row.odds.toFixed(2)}</td>
                                <td className="bet-place-tbl-td">{row.stake.toFixed(0)}</td>
                                <td className="bet-place-tbl-td">{row.mode}</td>
                                <td className="bet-place-tbl-td">{row.name}</td>
                                <td className="bet-place-tbl-td">{row.declared || ""}</td>
                                <td className={`bet-place-tbl-td ${row.netPnl >= 0 ? "text-success" : "text-danger"}`}>
                                  {row.netPnl ? row.netPnl.toFixed(0) : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lagderp1 result-title">Match Winner Bets</div>
                      <div id="getStatements" className="table-responsive">
                        <table className="table table-bordered header-top-spacing">
                          <thead>
                            <tr>
                              <th className="ldg-tbl-th match-box-color">Rate</th>
                              <th className="ldg-tbl-th match-box-color">Amt.</th>
                              <th className="ldg-tbl-th match-box-color">Mode</th>
                              <th className="ldg-tbl-th match-box-color">Team</th>
                              <th className="ldg-tbl-th match-box-color">Result</th>
                              <th className="ldg-tbl-th match-box-color">P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr><td colSpan={6} className="bet-place-tbl-td text-center">Loading...</td></tr>
                            ) : bookmakerRows.length === 0 ? (
                              <tr><td colSpan={6} className="bet-place-tbl-td text-center">No match winner bets found</td></tr>
                            ) : bookmakerRows.map((row, idx) => (
                              <tr key={`bookmaker-${idx}`}>
                                <td className="bet-place-tbl-td">{row.odds.toFixed(2)}</td>
                                <td className="bet-place-tbl-td">{row.stake.toFixed(0)}</td>
                                <td className="bet-place-tbl-td">{row.mode}</td>
                                <td className="bet-place-tbl-td">{row.name}</td>
                                <td className="bet-place-tbl-td">{row.declared || ""}</td>
                                <td className={`bet-place-tbl-td ${row.netPnl >= 0 ? "text-success" : "text-danger"}`}>
                                  {row.netPnl ? row.netPnl.toFixed(0) : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lagderp1 result-title">Fancy Bets</div>
                      <div id="getStatementsfancy" className="table-responsive">
                        <table className="table table-bordered header-top-spacing">
                          <thead>
                            <tr>
                              <th className="bet-place-tbl-th">Fancy</th>
                              <th className="bet-place-tbl-th">Runs</th>
                              <th className="bet-place-tbl-th">Rate</th>
                              <th className="bet-place-tbl-th">Amt.</th>
                              <th className="bet-place-tbl-th">Mode</th>
                              <th className="bet-place-tbl-th">Result</th>
                              <th className="bet-place-tbl-th">P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr><td colSpan={7} className="bet-place-tbl-td text-center">Loading...</td></tr>
                            ) : fancyRows.length === 0 ? (
                              <tr><td colSpan={7} className="bet-place-tbl-td text-center">No fancy bets found</td></tr>
                            ) : fancyRows.map((row, idx) => (
                              <tr key={`fancy-${idx}`}>
                                <td className="bet-place-tbl-td">{row.name}</td>
                                <td className="bet-place-tbl-td">{row.priceValue ? row.priceValue.toFixed(0) : ""}</td>
                                <td className="bet-place-tbl-td">{row.odds.toFixed(0)}</td>
                                <td className="bet-place-tbl-td">{row.stake.toFixed(0)}</td>
                                <td className="bet-place-tbl-td">{row.mode}</td>
                                <td className="bet-place-tbl-td">{row.declared || ""}</td>
                                <td className={`bet-place-tbl-td ${row.netPnl >= 0 ? "text-success" : "text-danger"}`}>
                                  {row.netPnl ? row.netPnl.toFixed(0) : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {error && <div className="result-error">{error}</div>}

                      <div id="divpnl" className={`lagderp2 col-xs-12 col-lg-12 result-summary-main ${netTotal >= 0 ? "text-success" : "text-danger"}`}>
                        {moneyText(netTotal)}
                      </div>

                      <div className="lagderp2 col-xs-6 col-lg-6 result-label">Match Plus Minus</div>
                      <div id="matchpnl" className={`lagderp2 col-xs-6 col-lg-6 result-value ${matchTotal >= 0 ? "text-success" : "text-danger"}`}>
                        {moneyText(matchTotal)}
                      </div>

                      <div className="lagderp2 col-xs-6 col-lg-6 result-label-alt">Fancy Plus Minus</div>
                      <div id="fancypnl" className={`lagderp2 col-xs-6 col-lg-6 result-value-alt ${fancyTotal >= 0 ? "text-success" : "text-danger"}`}>
                        {moneyText(fancyTotal)}
                      </div>

                      <div className="lagderp2 col-xs-6 col-lg-6 result-label">Total Commission</div>
                      <div id="compnl" className="lagderp2 col-xs-6 col-lg-6 result-value text-success">
                        {moneyText(totalCommission)}
                      </div>

                      <div className="lagderp2 col-xs-6 col-lg-6 result-label-alt">Mob. App. Charges</div>
                      <div id="pdc" className={`lagderp2 col-xs-6 col-lg-6 result-value-alt ${appCharges <= 0 ? "text-danger" : "text-success"}`}>
                        {moneyText(-Math.abs(appCharges))}
                      </div>

                      <div className="lagderp2 col-xs-6 col-lg-6 result-label">Net Plus Minus</div>
                      <div id="netpnl" className={`lagderp2 col-xs-6 col-lg-6 result-value ${netTotal >= 0 ? "text-success" : "text-danger"}`}>
                        {moneyText(netTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
