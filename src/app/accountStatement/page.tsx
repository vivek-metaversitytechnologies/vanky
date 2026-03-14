"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import BackButton from "../../components/Layout/BackButton";
import { fetchAccountStatement } from "../../store/actions/accountStatement";

export default function AccountStatementPage() {
  const [detailType, setDetailType] = useState("ALL");

  const today = new Date();
  const startOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const endOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;

  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(endOfMonth);

  const { rows, loading } = useSelector((state: RootState) => state.accountStatement);
  const { user } = useSelector((state: RootState) => state.auth);

  const loadStatements = async (nextDetailType = detailType, nextFrom = fromDate, nextTo = toDate) => {
    await fetchAccountStatement({
      detailType: nextDetailType,
      fromDate: nextFrom,
      toDate: nextTo,
      userId: "",
    });
  };

  useEffect(() => {
    loadStatements("ALL", startOfMonth, endOfMonth);
  }, []);

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value;
  };

  const getNumericColor = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num === 0) return "#000";
    return num > 0 ? "#008000" : "#cc0000";
  };

  const handleSearch = () => {
    loadStatements(detailType, fromDate, toDate);
  };

  const handleReset = () => {
    setDetailType("ALL");
    setFromDate(startOfMonth);
    setToDate(endOfMonth);
    loadStatements("ALL", startOfMonth, endOfMonth);
  };

  const handleTypeChange = (nextType) => {
    setDetailType(nextType);
    loadStatements(nextType, fromDate, toDate);
  };

  // ⭐ PAGINATION DISABLED WHEN NO ROWS
  const noData = rows.length === 0;

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <HeaderDesktop />

      {/* MOBILE MARQUEE */}
      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">

          {/* SIDEBAR */}
          <SidebarDesktop />

          {/* MAIN CONTENT */}
          <main className="desktop-main commission-wrap">

            {/* PAGE TITLE */}
            <div className="casino-heading no-radius uppercase acc-heading">
              Account Statement
              <BackButton />
            </div>

            {/* FILTER AREA */}
            <div className="commission-filters panel-body">
              <div className="filter-item">
                <input
                  type="date"
                  className="input-sm input-s form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <input
                  type="date"
                  className="input-sm input-s form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="filter-buttons-group">
                <button className="btn btn-s-md btn-success" onClick={handleSearch}>Search</button>
                <button className="btn btn-s-md btn-danger" onClick={handleReset}>Reset</button>
                <button className="btn btn-s-md btn-primary" onClick={() => handleTypeChange("ALL")}>All</button>
                <button className="btn btn-s-md btn-success" onClick={() => handleTypeChange("PL")}>P&amp;L</button>
                <button className="btn btn-s-md btn-danger" onClick={() => handleTypeChange("PDC")}>PDC</button>
                <button className="btn btn-s-md btn-light" onClick={() => handleTypeChange("ACCOUNT")}>Account</button>
              </div>
            </div>

            {/* TABLE */}
            <div className="panel panel-default table-panel">
              <div className="table-responsive">

                <table className="table table-bordered table-striped jambo_table account-table ">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="tablelightblue">Date</th>
                      <th className="tabledarkblue">Description</th>
                      <th className="tablelightblue">Prev. Bal</th>
                      <th className="tabledarkblue">CR</th>
                      <th className="tablelightblue">DR</th>
                      <th className="tabledarkblue">Comm+</th>
                      <th className="tablelightblue">Comm-</th>
                      <th className="tabledarkblue">Balance</th>
                    </tr>
                  </thead>

                  <tbody id="statements">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, i) => (
                        <tr key={i}>
                          <td>{formatValue(item.date)}</td>
                          <td>{formatValue(item.description)}</td>
                          <td style={{ color: getNumericColor(item.opening) }}>{formatValue(item.opening)}</td>
                          <td style={{ color: "#008000" }}>{formatValue(item.credit)}</td>
                          <td style={{ color: "#cc0000" }}>{formatValue(item.debit)}</td>
                          <td style={{ color: getNumericColor(item.commissionPlus) }}>{formatValue(item.commissionPlus)}</td>
                          <td style={{ color: getNumericColor(item.commissionMinus) }}>{formatValue(item.commissionMinus)}</td>
                          <td style={{ color: getNumericColor(item.closing) }}>{formatValue(item.closing)}</td>
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
