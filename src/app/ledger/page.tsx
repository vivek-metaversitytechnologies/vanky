"use client";

import { useState, useEffect } from "react";
import { urbApiClient } from "../../config/axiosConfig";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import BackButton from "../../components/Layout/BackButton";

type LedgerRow = {
  date?: string;
  time?: string;
  remark?: string;
  wonBy?: string;
  won?: number;
  lost?: number;
  balance?: number;
  matchId?: number;
};

export default function LedgerPage() {
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (value?: number) => Number(value || 0).toFixed(2);

  const loadLedger = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await urbApiClient.post("/enduser/ledger", {});
      const list = Array.isArray(response?.data?.data) ? response.data.data : [];
      setRows(list);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Unable to fetch ledger";
      setRows([]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const lenaTotal = rows.reduce((sum, item) => sum + Number(item.won || 0), 0);
  const denaTotal = rows.reduce((sum, item) => sum + Number(item.lost || 0), 0);
  const netBalance = lenaTotal - denaTotal;
  const balanceLabel =
    netBalance === 0
      ? `${formatNumber(0)} Settled`
      : `${formatNumber(Math.abs(netBalance))} ${netBalance > 0 ? "Lena Hai" : "Dena Hai"}`;

  // 👉 DISABLE PAGINATION IF NO ROWS
  const noData = rows.length === 0;

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

            <div className="casino-heading no-radius uppercase acc-heading">
              Company Lena Dena
              <BackButton />
            </div>

            <div className="commission-filters panel-body">
              <div className="filter-item">
                <input type="date" className="dark-text input-s form-control" />
              </div>

              <div className="filter-item">
                <input type="date" className="dark-text input-s form-control" />
              </div>

              <div className="filter-item">
                <select className="dark-text form-control m-0">
                  <option value="REP">All</option>
                  <option value="SET">Settlement</option>
                </select>
              </div>

              <div className="filter-btn-area">
                <button className="btn btn-s-md btn-success" onClick={loadLedger} disabled={loading}>
                  <i className="fa fa-search"></i> Search
                </button>
              </div>
            </div>

            <div className="ledger-summary-box">
              <div className="summary-item">
                <strong>Lena:</strong>
                <span className="summary-green summary">{formatNumber(lenaTotal)}</span>
              </div>

              <div className="summary-item">
                <strong>Dena:</strong>
                <span className="summary-red summary">{formatNumber(denaTotal)}</span>
              </div>

              <div className="summary-item">
                <strong>Balance:</strong>
                <span
                  className={`summary ${
                    netBalance > 0 ? "summary-green" : netBalance < 0 ? "summary-red" : "summary-neutral"
                  }`}
                >
                  {balanceLabel}
                </span>
              </div>
            </div>

            <div className="panel panel-default table-panel">
              <div className="table-responsive">

                <table className="table table-dark table-striped jambo_table account-table">
                  <thead>
                    <tr>
                      <th className="tablelightblue">Date</th>
                      <th className="tabledarkblue">Collection Name</th>
                      <th className="tablelightblue">Debit</th>
                      <th className="tabledarkblue">Credit</th>
                      <th className="tablelightblue">Balance</th>
                      <th className="tabledarkblue">Payment Type</th>
                      <th className="tablelightblue">Remark</th>
                    </tr>
                  </thead>

                  <tbody id="statements">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-400">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-red-400">
                          {error}
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-400">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, index) => (
                        <tr key={index}>
                          <td>{[item.date, item.time].filter(Boolean).join(" ") || "-"}</td>

                          <td>
                            <span style={{ fontWeight: 600 }}>{item.remark || "-"}</span>
                          </td>

                          <td className="red"><div>{formatNumber(item.lost)}</div></td>
                          <td className="green"><div>{formatNumber(item.won)}</div></td>
                          <td className="red"><div>{formatNumber(item.balance)}</div></td>

                          <td>{item.wonBy || "-"}</td>
                          <td>{item.matchId ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

              </div>

              {/* PAGINATION */}
              <div className="pagination-wrap center-pagi">
                <ul className="pagination">

                  <li className={`page-item ${noData ? "disabled" : ""}`}>
                    <span className="page-link">
                      <i className="fa fa-caret-left"></i>
                      <i className="fa fa-caret-left"></i>
                    </span>
                  </li>

                  <li className={`page-item ${noData ? "disabled" : ""}`}>
                    <span className="page-link">
                      <i className="fa fa-caret-left"></i>
                    </span>
                  </li>

                  <li className={`page-item active ${noData ? "disabled" : ""}`}>
                    <button className="page-link">1</button>
                  </li>

                  <li className={`page-item ${noData ? "disabled" : ""}`}>
                    <span className="page-link">
                      <i className="fa fa-caret-right"></i>
                    </span>
                  </li>

                  <li className={`page-item ${noData ? "disabled" : ""}`}>
                    <span className="page-link">
                      <i className="fa fa-caret-right"></i>
                      <i className="fa fa-caret-right"></i>
                    </span>
                  </li>

                </ul>
              </div>

            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
