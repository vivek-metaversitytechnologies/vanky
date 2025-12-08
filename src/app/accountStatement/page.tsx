"use client";

import { useState, useEffect } from "react";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import BackButton from "../../components/Layout/BackButton";

export default function AccountStatementPage() {
  // ⭐ STORE TABLE ROW DATA IN STATE
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // ⭐ LOAD STATIC DATA (Later you can fetch from API)
    const data = [
      {
        date: "26 Nov 2025 23:36 PM",
        desc: "Cricket / Royal Champs v Aspin Stallions / Match / Royal Champs v Aspin Stallions / 34998526 / Aspin Stallions",
        prev: 1000,
        cr: 0,
        dr: 0,
        commPlus: 0,
        commMinus: 0,
        bal: "1,000.00",
      },
      {
        date: "23 Nov 2025 13:24 PM",
        desc: "Cricket / Bangladesh v Ireland / Match / Bangladesh v Ireland / 34958715 / Bangladesh",
        prev: 1000,
        cr: 0,
        dr: 0,
        commPlus: 0,
        commMinus: 0,
        bal: "1,000.00",
      }
    ];

    setRows(data); // 👉 REMOVE OR SET EMPTY [] TO TEST PAGINATION DISABLED
  }, []);

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
                <input type="date" className="input-sm input-s form-control" />
              </div>

              <div className="filter-item">
                <input type="date" className="input-sm input-s form-control" />
              </div>

              <div className="filter-buttons-group">
                <button className="btn btn-s-md btn-success">Search</button>
                <button className="btn btn-s-md btn-danger">Reset</button>
                <button className="btn btn-s-md btn-primary">All</button>
                <button className="btn btn-s-md btn-success">P&amp;L</button>
                <button className="btn btn-s-md btn-danger">PDC</button>
                <button className="btn btn-s-md btn-light">Account</button>
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
                    {rows.length === 0 ? (
                      <tr>
                        <td className="text-center py-4 text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, i) => (
                        <tr key={i}>
                          <td>{item.date}</td>
                          <td>{item.desc}</td>
                          <td>{item.prev}</td>
                          <td>{item.cr}</td>
                          <td>{item.dr}</td>
                          <td>{item.commPlus}</td>
                          <td>{item.commMinus}</td>
                          <td>{item.bal}</td>
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
