"use client";

import { useState, useEffect } from "react";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import BackButton from "../../components/Layout/BackButton";

export default function LedgerPage() {
  // ⭐ STATE FOR LEDGER ROWS
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // SAMPLE STATIC DATA — replace with API later
    const data = [
      {
        date: "26 Nov 2025 23:36 PM",
        name: "Cricket - Royal Champs v Aspin Stallions",
        debit: "0.00",
        credit: "0.00",
        balance: "0.00",
        type: "-",
        remark: "User Minus",
      },
      {
        date: "23 Nov 2025 13:24 PM",
        name: "Cricket - Bangladesh v Ireland",
        debit: "0.00",
        credit: "0.00",
        balance: "0.00",
        type: "-",
        remark: "User Minus",
      }
    ];

    setRows(data); 
    // To test disabled pagination → setRows([])

  }, []);

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
                <button className="btn btn-s-md btn-success">
                  <i className="fa fa-search"></i> Search
                </button>
              </div>
            </div>

            <div className="ledger-summary-box">
              <div className="summary-item">
                <strong>Lena:</strong>
                <span className="summary-green summary">0.00</span>
              </div>

              <div className="summary-item">
                <strong>Dena:</strong>
                <span className="summary-red summary">0.00</span>
              </div>

              <div className="summary-item">
                <strong>Balance:</strong>
                <span className="summary-neutral summary">0 Dena Hai</span>
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
                    {rows.length === 0 ? (
                      <tr>
                        <td  className="text-center py-4 text-gray-400">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, index) => (
                        <tr key={index}>
                          <td>{item.date}</td>

                          <td>
                            <a href="#" style={{ fontWeight: 600 }}>
                              {item.name}
                            </a>
                          </td>

                          <td className="red"><div>{item.debit}</div></td>
                          <td className="green"><div>{item.credit}</div></td>
                          <td className="red"><div>{item.balance}</div></td>

                          <td>{item.type}</td>
                          <td>{item.remark}</td>
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
